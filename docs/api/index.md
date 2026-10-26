---
slug: /api
title: "API et intégrations"
---

Connectez votre logiciel à la planification Artiforce, recevez les changements de rendez-vous et intégrez la réservation sur votre site.

## Choisir le bon accès

| Besoin | Accès | Documentation |
| --- | --- | --- |
| Lire ou modifier les rendez-vous depuis votre serveur | Clé API au nom d’un membre | [Authentification](authentification.md), [planification](planification.md) |
| Recevoir les changements | Endpoint HTTPS et signature | [Webhooks](webhooks.md) |
| Consulter l’agenda dans un autre calendrier | Adresse ICS secrète | [Calendriers](calendriers.md) |
| Connecter son compte Google | Session du membre puis autorisation Google | [Google Calendar](google-calendar.md) |
| Ajouter la prise de rendez-vous à votre site | Lien public ou widget | [Réservation](reservation.md) |

Une clé API ne donne pas accès à toute l’application. Elle ne permet ni de gérer les clés ou les webhooks, ni de connecter le compte Google d’un membre, ni d’administrer son entreprise.

## Contrat téléchargeable

- [OpenAPI de la planification, édition du 26 octobre 2026](/api/openapi/planning-2026-10-26.json).
- [Contrat publié par le service API](https://api.artinova.fr/v1/planning/openapi.json).

Le fichier versionné décrit les opérations utilisables par clé API et les messages webhook. Les exemples de cette documentation utilisent `https://api.artinova.fr` : le changement de nom du produit ne change pas les adresses techniques, les noms de champs ou les attributs du widget.

## Premier appel

Créez une clé dans votre espace, puis remplacez les valeurs de démonstration ci-dessous. Gardez la clé sur votre serveur, jamais dans le code d’une page publique.

```bash
export ARTIFORCE_API_KEY='REMPLACER_PAR_VOTRE_CLE'
export ARTIFORCE_TENANT_ID='REMPLACER_PAR_VOTRE_ENTREPRISE'
curl --fail-with-body   "https://api.artinova.fr/v1/tenants/$ARTIFORCE_TENANT_ID/planning/context"   --header "Authorization: Bearer $ARTIFORCE_API_KEY"
```

L’[authentification](authentification.md) explique les droits nécessaires et les erreurs possibles.
