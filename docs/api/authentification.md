---
slug: /api/authentification
title: "Authentification et droits"
description: "Authentifiez vos appels à l’API Artiforce : création de clés, permissions de planification, limites de requêtes et distinction avec la session utilisateur."
---

## Créer une clé

Le propriétaire de l’entreprise crée une clé dans **Réglages > Agenda > Accès API et webhooks**. Il choisit un nom, le membre au nom duquel la clé agit, ses permissions et une éventuelle expiration. La valeur complète n’est montrée qu’à la création. Conservez-la dans le gestionnaire de secrets de votre application.

Le format est `ak_<prefixe>_<secret>`. Utilisez l’en-tête :

```http
Authorization: Bearer ak_PREFIXE_SECRET
```

Une entreprise peut avoir au plus **10 clés actives**. Pour remplacer une clé perdue, créez-en une nouvelle et révoquez l’ancienne. La révocation prend effet dès la requête suivante.

## Permissions effectives

Les droits sont ceux du membre, limités par les permissions de la clé. Une diminution des droits du membre s’applique également à la clé. Une clé révoquée, expirée ou rattachée à un membre inactif est refusée.

| Permission de clé | Usage |
| --- | --- |
| `planning:read` | Lire les informations de planification accessibles au membre. |
| `planning:write` | Créer et modifier les événements dans les limites du membre. |

**L’écriture n’inclut pas la lecture.** Pour modifier un rendez-vous ou changer son état, accordez les deux permissions. Une clé limitée à l’écriture peut seulement créer. La recherche de créneaux utilise `POST` : elle nécessite `planning:write` et un droit de consultation global du planning pour le membre.

Une clé ne permet jamais de supprimer un événement ni d’exercer les fonctions d’administration `planning:manage`. Les rendez-vous s’annulent au moyen d’une transition d’état.

## Gestion réservée au propriétaire

Ces routes nécessitent la session du propriétaire, et refusent les clés API :

| Méthode et chemin | Résultat |
| --- | --- |
| `GET /v1/tenants/{tenantId}/api-keys` | Liste des clés, y compris révoquées et expirées. |
| `POST /v1/tenants/{tenantId}/api-keys` | Création ; réponse `{ apiKey, key }`. |
| `DELETE /v1/tenants/{tenantId}/api-keys/{id}` | Révocation, réponse 204. |

La création prend `{ name, scopes, actingUserId, expiresAt? }`. `scopes` est la liste explicite des permissions ci-dessus. `actingUserId` désigne un membre actif ; `expiresAt`, s’il est fourni, doit être dans le futur.

## Limites et refus

La limite est de **120 requêtes par minute et par clé**. Au-delà de 1 200 requêtes, un blocage de 15 minutes s’applique. Une réponse 429 indique normalement l’attente dans `Retry-After`, en secondes, et `details.retryAfterSeconds`. Respectez ce délai avant de réessayer.

| HTTP | Code | Conduite à tenir |
| --- | --- | --- |
| 401 | `API_KEY_INVALID` | Vérifier la clé, son expiration et le membre. |
| 403 | `API_KEY_SCOPE_MISSING` | Vérifier les permissions de la clé et du membre. |
| 404 | `TENANT_NOT_FOUND` | Vérifier l’identifiant d’entreprise associé à la clé. |
| 409 | `TENANT_PENDING_ACTIVATION` | Terminer l’activation de l’entreprise. |
| 402 | `TENANT_PAYMENT_OVERDUE` | Régulariser la situation indiquée dans l’espace. |
| 429 | `API_KEY_RATE_LIMITED` | Attendre avant de réessayer. |

Les identifiants d’une autre entreprise ne permettent pas de contourner les droits. Un accès hors périmètre peut répondre 404.
