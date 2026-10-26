---
slug: /api/calendriers
title: "Flux et abonnements calendrier ICS"
description: "Consultez vos rendez-vous Artiforce avec un abonnement ICS et ajoutez des calendriers externes : accès par session, adresses secrètes et actualisation."
---

Les flux ICS permettent de consulter les événements Artiforce dans un calendrier compatible. Les adresses de calendriers externes permettent aussi de tenir compte des indisponibilités d’un membre dans la recherche de créneaux.

Ces réglages nécessitent une **session utilisateur** ; les clés API de planification ne les gèrent pas.

## Publier un flux Artiforce

Dans les réglages calendrier, créez un flux personnel (`MEMBER`) ou un flux d’équipe (`TEAM`). Le flux personnel contient les affectations du membre. Le flux d’équipe demande les droits de gestion et contient les événements de l’entreprise.

La création retourne `{ feed, path }`. L’adresse n’est montrée qu’une fois. Ajoutez l’origine API au chemin retourné, par exemple :

```text
https://api.artinova.fr/v1/public/calendar-feeds/VOTRE_JETON.ics
```

Dans votre calendrier externe, choisissez **S’abonner à une adresse** plutôt qu’un import ponctuel de fichier. La fréquence d’actualisation dépend du calendrier qui consulte le flux.

## Contenu et confidentialité

Le flux couvre les événements qui chevauchent les 30 jours précédents et les 90 jours suivants, avec au plus 2 000 événements, les premiers chronologiquement.

Il contient les horaires, le titre ou le type d’intervention et la commune, l’adresse et le nom du client. Un flux d’équipe peut préciser les membres affectés. Il n’inclut ni notes internes, ni numéro de téléphone, ni e-mail client, ni prix, ni document.

**Toute personne qui connaît l’adresse peut lire son contenu.** Ne la publiez pas. Pour remplacer une adresse divulguée, révoquez le flux et créez-en un autre. Un flux révoqué ou dont les droits ne sont plus valides répond 404.

## Ajouter un calendrier externe

Chaque membre peut ajouter l’adresse ICS de son propre calendrier. Les périodes occupées sont utilisées pour réduire les créneaux proposés. Les événements transparents ou annulés ne bloquent pas les disponibilités. Les événements Artiforce réimportés ne doivent pas bloquer une seconde fois leur propre créneau.

La lecture est périodique, elle n’est pas instantanée. Si la source reste en échec et qu’aucune lecture n’a réussi depuis plus de 24 heures, ses anciennes indisponibilités cessent de bloquer les créneaux. Vérifiez donc l’état de vos connexions.

## Routes de configuration

Base : `/v1/tenants/{tenantId}/planning`, authentification par session.

| Méthode et chemin | Usage |
| --- | --- |
| `GET /calendar-feeds` | Lister les flux autorisés. |
| `POST /calendar-feeds` | Créer un flux et obtenir son adresse. |
| `DELETE /calendar-feeds/{id}` | Révoquer un flux. |
| `GET /calendar-sources` | Lister les sources visibles. |
| `POST /calendar-sources` | Ajouter son propre calendrier. |
| `DELETE /calendar-sources/{id}` | Retirer une source et ses indisponibilités. |

Les services Google, Apple, Outlook et Proton peuvent avoir des possibilités et rythmes d’abonnement différents. Cette documentation ne garantit pas une synchronisation instantanée ou bidirectionnelle avec chacun d’eux.
