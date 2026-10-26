---
slug: /api/reservation
title: "Réservation en ligne et widget"
---

Partagez votre page de réservation ou intégrez-la à votre site. Avant de commencer, configurez dans Artiforce la zone d’intervention, les types réservables, les membres et leurs horaires, puis activez la réservation en ligne.

Les exemples utilisent `https://app.artinova.fr`. Remplacez `VOTRE-ENTREPRISE` par l’identifiant de lien de votre espace. Le changement de nom du produit ne modifie pas les attributs techniques `data-artinova-*`.

## Partager un lien

```text
https://app.artinova.fr/rdv/VOTRE-ENTREPRISE
```

Cette page autonome ne doit pas être placée dans une iframe. Pour une intégration, utilisez `/embed/rdv/…` ou le script ci-dessous.

## Intégrer le widget

Sur une page HTTPS qui autorise le JavaScript :

```html
<div data-artinova-booking="VOTRE-ENTREPRISE"></div>
<script src="https://app.artinova.fr/embed/v1.js" async></script>
```

Le widget ajoute une iframe dont la hauteur s’adapte au contenu. Plusieurs conteneurs peuvent être présents sur une page. Vous pouvez cibler un élément avec `data-target="#prise-de-rdv"` et personnaliser l’accent avec `data-color="2457d6"`. La couleur reste soumise à un contrôle de lisibilité. Le formulaire est en français ; `data-lang` ne fournit pas de traduction supplémentaire.

Si votre éditeur supprime les scripts, utilisez une iframe de hauteur fixe :

```html
<iframe
  src="https://app.artinova.fr/embed/rdv/VOTRE-ENTREPRISE"
  title="Prise de rendez-vous"
  loading="lazy"
  style="display:block;width:100%;height:900px;border:0"
></iframe>
```

Dans les réglages, limitez les sites autorisés à intégrer le formulaire si nécessaire. Avec un éditeur qui ajoute sa propre iframe, son origine doit aussi être autorisée. La compatibilité avec chaque constructeur de site doit être vérifiée sur votre page publiée.

## Suivre une confirmation

Le conteneur émet `artinova:booking:confirmed`. Le détail fournit la référence, sans les coordonnées du client :

```js
document.querySelector('[data-artinova-booking]')
  .addEventListener('artinova:booking:confirmed', (event) => {
    console.log('Référence de réservation', event.detail.reference);
  });
```

Une réservation peut être confirmée directement ou attendre validation, selon son type. Ne considérez pas chaque référence reçue comme une intervention déjà confirmée.

## API publique de réservation

Base : `/v1/public/booking`. Ces routes ne nécessitent pas de session. Elles utilisent l’identifiant public de l’entreprise et, selon l’opération, des jetons temporaires. Elles n’acceptent pas une clé API de planification à la place de ces jetons.

| Méthode et chemin | Usage |
| --- | --- |
| GET `/{slug}/context` | Entreprise, types réservables et choix proposés. |
| POST `/{slug}/coverage` | `{ address }` ; reçoit un jeton d’adresse et le résultat de couverture. |
| GET `/{slug}/slots` | `addressToken`, `interventionTypeId`, `memberId?`, `from?` ; reçoit les créneaux et leurs jetons. |
| POST `/{slug}/bookings` | Réserver avec `Idempotency-Key`. |
| GET `/manage` | Consulter avec le jeton de gestion en Bearer. |
| POST `/manage/cancel` | Annuler, avec Bearer et `Idempotency-Key`. |
| POST `/manage/reschedule/accept` | Accepter le créneau proposé. |
| POST `/manage/reschedule/decline` | Garder le créneau actuel. |

Le corps de réservation est `{ slotToken, addressToken, interventionTypeId, memberId?, contact: { firstName, lastName, email, phone }, notes?, consent: true }`. La réponse 201 contient `{ reference, status, windowStart, windowEnd }`.

Le jeton d’adresse dure 30 minutes, le jeton de créneau 15 minutes. Un créneau pris entre-temps donne 409 `SLOT_NO_LONGER_AVAILABLE` : demandez de nouveaux créneaux en gardant le formulaire saisi. Une même clé d’idempotence avec un autre corps donne `BOOKING_IDEMPOTENCY_CONFLICT`.

Les limites par adresse IP sont de 120 lectures par minute, 20 vérifications d’adresse par minute et 10 écritures par tranche de 10 minutes. Une réponse 429 `BOOKING_RATE_LIMITED` indique l’attente avec `Retry-After`. Une entreprise introuvable ou une réservation désactivée répond 404 `BOOKING_NOT_FOUND`.

## Liens privés de gestion

Le lien de gestion utilise `/gerer#t=JETON`. Les jetons privés ne doivent pas être publiés ni ajoutés à vos outils de suivi d’audience. Le formulaire ne requiert pas de compte Artiforce pour le client.
