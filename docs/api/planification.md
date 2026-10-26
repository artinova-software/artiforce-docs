---
slug: /api/planification
title: "Contrat de planification"
---

Base : `https://api.artinova.fr/v1/tenants/{tenantId}/planning`.

Les chemins ci-dessous s’ajoutent à cette base. Les données et les champs obligatoires sont décrits dans le [fichier OpenAPI versionné](/api/openapi/planning-2026-10-26.json).

## Opérations par clé API

| Méthode | Chemin | Usage |
| --- | --- | --- |
| GET | `/context` | Fuseau horaire et date de l’entreprise. |
| GET | `/settings` | Réglages de planification. |
| POST | `/geocode` | Vérifier une adresse : corps `{ address }`. |
| GET | `/members` | Membres actifs accessibles. |
| GET | `/members/{userId}/sector-assignments?from&to` | Affectations datées à des secteurs. |
| GET | `/skills?includeArchived` | Compétences. |
| GET | `/intervention-types?includeArchived` | Types d’intervention. |
| GET | `/events?from&to&userIds` | Événements sur une période. |
| GET | `/next-appointment?userIds` | Prochain rendez-vous, ou `null`. |
| GET | `/events/{eventId}` | Détail d’un événement. |
| POST | `/events` | Créer un événement ; `Idempotency-Key` obligatoire. |
| PATCH | `/events/{eventId}` | Modifier avec sa `version`. |
| POST | `/events/{eventId}/transitions` | Changer l’état avec `{ to, version }`. |
| POST | `/slots/search` | Rechercher les créneaux possibles. |

Les réglages d’administration, les horaires, les affectations et le catalogue se configurent dans l’application avec les droits adaptés. Les routes d’administration ne font pas partie du contrat pour clés API. Les propositions de déplacement demandant l’accord du client nécessitent également une session utilisateur.

## Lire une période

`from` et `to` sont des dates `YYYY-MM-DD` dans le fuseau de l’entreprise, actuellement `Europe/Paris`. Pour les événements, la période ne dépasse pas 92 jours ; pour les affectations à un secteur, 366 jours. `userIds` est une liste séparée par des virgules : omis, tous les événements autorisés ; vide, aucun.

```bash
curl --get --fail-with-body   "https://api.artinova.fr/v1/tenants/$ARTIFORCE_TENANT_ID/planning/events"   --header "Authorization: Bearer $ARTIFORCE_API_KEY"   --data-urlencode 'from=2026-11-02'   --data-urlencode 'to=2026-11-08'
```

La réponse contient `{ timeZone, events }`. Les événements qui chevauchent la période sont renvoyés dans l’ordre du début, puis de leur identifiant. Un membre limité à ses propres événements n’obtient pas ceux des autres membres.

## Créer sans doublon

Envoyez `Idempotency-Key`, composée de 1 à 128 caractères parmi les lettres, chiffres, `.`, `_`, `:` et `-`. Conservez la même clé lors de la reprise d’une même demande après une interruption réseau.

- Même clé et même corps : le même événement est renvoyé, avec HTTP 201.
- Même clé et corps différent : HTTP 409, `PLANNING_IDEMPOTENCY_CONFLICT`.

Un événement comporte un type (`APPOINTMENT`, `PERSONAL` ou `UNAVAILABILITY`), son horaire et ses affectations. Une affectation est `{ userId, role }`. Un rendez-vous nécessite un membre principal `MAIN` et peut inclure des membres secondaires ; leur disponibilité est vérifiée également. Consultez le schéma `CreatePlanningEventDto` pour la forme complète.

## Horaires et changements d’heure

Un horaire local utilise `{ date, startMinute, durationMin?, arrivalWindowMin?, ambiguity? }`. Les minutes se comptent depuis minuit. Un événement sur des journées entières utilise `{ allDay: { startDate, endDate } }`, avec une date de fin exclusive.

Les instants de la réponse sont des chaînes ISO 8601 en UTC. La durée de l’intervention et la fenêtre d’arrivée sont distinctes.

Une heure inexistante au passage à l’heure d’été est refusée (`NONEXISTENT_LOCAL_TIME`). Une heure répétée au passage à l’heure d’hiver demande `ambiguity: "earlier"` ou `"later"`, sinon `AMBIGUOUS_LOCAL_TIME`. Ne convertissez pas une heure locale en ajoutant un décalage UTC fixe.

## Modifier avec une version

Une modification et une transition prennent la `version` lue sur l’événement. Une version devenue obsolète donne 409 `VERSION_CONFLICT` : relisez l’événement avant de décider s’il faut rejouer la modification. Les champs absents d’un PATCH sont conservés ; les champs qui l’autorisent peuvent être vidés avec `null`.

Un rendez-vous créé par l’équipe commence à `CONFIRMED`. Les transitions possibles sont :

- `PENDING_APPROVAL` vers `CONFIRMED`, `DECLINED` ou `CANCELLED` ;
- `CONFIRMED` vers `IN_PROGRESS`, `COMPLETED` ou `CANCELLED` ;
- `IN_PROGRESS` vers `COMPLETED` ou `CANCELLED` ;
- `CANCELLED` vers `CONFIRMED`, avec une nouvelle vérification des chevauchements.

Une autre transition est refusée avec `PLANNING_INVALID_TRANSITION`. Un rendez-vous ne se supprime pas : annulez-le. La transparence `FREE` est réservée aux événements `PERSONAL`.

## Rechercher un créneau

`POST /slots/search` prend `{ interventionTypeId, address, from?, horizonDays?, preferredUserId?, excludeEventId? }`. La durée recherchée va de 1 à 92 jours. Le centre d’intervention doit être configuré.

Le résultat tient compte des horaires, compétences, secteurs, événements bloquants et indisponibilités externes connues. Une suggestion ne réserve rien : la création vérifie à nouveau le créneau. Un chevauchement donne 409 `PLANNING_OVERLAP`.

## Gérer les erreurs

| HTTP | Code | Signification |
| --- | --- | --- |
| 409 | `VERSION_CONFLICT` | L’événement a changé depuis votre lecture. |
| 409 | `PLANNING_OVERLAP` | Un membre est déjà occupé. |
| 409 | `PLANNING_WRITE_CONFLICT` | Conflit d’écriture ; vérifier `details.retryable`. |
| 422 | `ADDRESS_NOT_FOUND` | Adresse non reconnue. |
| 503 | `ADDRESS_SERVICE_UNAVAILABLE` | Service d’adresses indisponible. |
| 422 | `PLANNING_CENTER_REQUIRED` | Centre non configuré. |
| 422 | `PLANNING_ASSIGNMENTS_INVALID` | Membres dupliqués ou principal manquant. |
| 422 | `PLANNING_DURATION_REQUIRED` | Durée absente et non fournie par le type. |
| 422 | `PLANNING_RANGE_TOO_LONG` | Période trop longue. |
| 404 | `PLANNING_EVENT_NOT_FOUND` | Événement absent ou hors de votre périmètre. |

Traitez le code et le statut HTTP, plutôt que le texte du message. Ne rejouez pas automatiquement une erreur de validation.
