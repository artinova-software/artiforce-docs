---
slug: /api/webhooks
title: "Recevoir les changements par webhook"
description: "Recevez les changements de rendez-vous Artiforce par webhook : configuration HTTPS, événements, signature Standard Webhooks et gestion des doublons."
---

Les webhooks notifient votre serveur lorsqu’un rendez-vous change. Configurez un endpoint HTTPS dans **Réglages > Agenda > Accès API et webhooks**, avec la session du propriétaire.

## Configurer la destination

Votre URL doit utiliser HTTPS sur le port standard, sans identifiants dans l’URL, et résoudre vers une adresse publique. Une entreprise peut enregistrer au plus **5 endpoints**. Le secret `whsec_...` est affiché une seule fois à la création. Conservez-le côté serveur et testez la réception avant de vous abonner aux événements utiles.

Sous `/v1/tenants/{tenantId}/webhook-endpoints`, la session du propriétaire permet de lister (`GET`), créer (`POST`), modifier (`PATCH /{id}`), supprimer (`DELETE /{id}`), tester (`POST /{id}/test`) et consulter les dernières livraisons (`GET /{id}/deliveries`). Une clé API ne peut pas gérer ces routes. La création retourne `{ endpoint, secret }`. Le journal présente au plus les 50 dernières livraisons, conservées 30 jours après leur dernière tentative achevée.

## Événements

- `appointment.created`
- `appointment.updated`
- `appointment.confirmed`
- `appointment.cancelled`
- `appointment.completed`
- `webhook.ping`, pour les tests

Un changement vers un état confirmé, annulé ou terminé possède son événement dédié. Les autres modifications d’un rendez-vous utilisent `appointment.updated`. Les événements personnels et indisponibilités ne déclenchent pas ces notifications.

```json
{
  "type": "appointment.confirmed",
  "timestamp": "2026-10-26T09:12:03.120Z",
  "apiVersion": "2026-10-25",
  "tenantId": "00000000-0000-4000-8000-000000000001",
  "data": {
    "id": "00000000-0000-4000-8000-000000000002",
    "kind": "APPOINTMENT",
    "status": "CONFIRMED"
  }
}
```

Cet exemple est abrégé. `data` reprend le rendez-vous retourné par l’API, sans `internalNotes`. Pour `webhook.ping`, les données identifient l’endpoint.

## Vérifier la signature

Les en-têtes suivent Standard Webhooks :

| En-tête | Contenu |
| --- | --- |
| `webhook-id` | Identifiant stable du message, réutilisé lors des nouvelles tentatives. |
| `webhook-timestamp` | Date Unix de la tentative, en secondes. |
| `webhook-signature` | Signature `v1,<base64>`. |

La signature est le HMAC-SHA256 de `id.timestamp.body`, avec les octets exacts du corps reçu. La clé est la partie du secret située après `whsec_`, décodée depuis base64. Vérifiez la fraîcheur de l’horodatage, comparez les signatures en temps constant, puis seulement traitez le message. Utilisez de préférence une bibliothèque Standard Webhooks adaptée à votre serveur.

## Répondre et éviter les doublons

Répondez rapidement avec un code 2xx après avoir conservé le message. Dédoublonnez sur `webhook-id`. Les messages peuvent arriver plusieurs fois ou dans un ordre différent de celui des modifications.

Une réponse hors 2xx, une redirection ou un dépassement de 10 secondes entraîne une nouvelle tentative. Huit tentatives sont prévues au total, avec les délais successifs 5 secondes, 5 minutes, 30 minutes, 2 heures, 5 heures, 10 heures et 10 heures, légèrement allongés de manière aléatoire.

Une réponse **410 Gone** désactive immédiatement l’endpoint. Trois jours d’échecs sans aucun succès le désactivent également. Après correction, réactivez-le dans les réglages. Pour synchroniser votre logiciel après une interruption, relisez les événements avec l’API.
