---
slug: /api/google-calendar
title: "Connecter Google Calendar"
---

Chaque membre connecte son propre compte Google depuis les réglages calendrier. La connexion nécessite une session Artiforce et l’autorisation explicite du compte Google concerné. Une clé API ne permet pas d’effectuer cette connexion.

## Parcours

1. Ouvrez les réglages calendrier et choisissez la connexion Google.
2. Autorisez l’accès demandé par Google avec le compte souhaité.
3. Revenez dans Artiforce et choisissez le calendrier qui recevra vos rendez-vous.
4. Vérifiez l’état de la connexion et le résultat sur un rendez-vous.

La connexion est disponible lorsque le service Google est configuré pour votre environnement. Si les réglages indiquent que le service n’est pas configuré, contactez l’équipe Artiforce ; une clé API personnelle ne suffit pas à l’activer.

## Ce qui est synchronisé

Les périodes occupées du calendrier connecté influencent les créneaux proposés. Les rendez-vous Artiforce sont copiés dans le calendrier sélectionné. Cette fonction n’est pas une édition bidirectionnelle générale des événements : modifiez les rendez-vous dans Artiforce.

La liste des calendriers proposés comprend ceux dont le compte connecté est propriétaire. Vérifiez les permissions accordées à la connexion et le calendrier choisi avant d’y copier des informations clients.

## Routes réservées aux sessions

Base : `/v1/tenants/{tenantId}/planning/integrations/google`.

| Méthode et chemin | Usage |
| --- | --- |
| GET `/` | État `{ configured, items }`. |
| POST `/authorize` | Démarrer avec `{ returnTo: "team" }` ou `{ returnTo: "account" }` ; reçoit `{ authorizationUrl }`. |
| POST `/callback` | Terminer le retour d’autorisation pour le même membre. |
| GET `/calendars` | Calendriers accessibles pour la copie. |
| PUT `/write-calendar` | Choisir le calendrier de destination. |
| DELETE `/{id}` | Déconnecter le compte selon les droits du membre. |

Le retour d’autorisation passe par `/account/google-calendar` sur l’application. Il est lié à la session qui a lancé la connexion : ne partagez pas une URL d’autorisation pour connecter le compte d’une autre personne.

## En cas d’erreur

Vérifiez le compte Google utilisé, les autorisations accordées et l’état de la connexion. Si une autorisation est refusée ou révoquée, recommencez le parcours depuis Artiforce. Le retrait d’une connexion et les événements déjà copiés ne doivent pas être confondus : vérifiez votre calendrier avant d’effacer des événements.
