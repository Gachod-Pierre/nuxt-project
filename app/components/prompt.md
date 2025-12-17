# Utilisation de l'IA

## Stylisation et mise en forme

J'ai utilisé l'IA pour la stylisation et la mise en forme de certaines pages composants en fonction du style général du site.

**Exemple de prompt utilisé :**

> "Réalise pour moi la stylisation de cette page/ce composant en fonction du style général du site.
> Pour ce faire tu devrais avoir recours à la méthodologie ABEM pour le nommage des classes, et utiliser correctement le SCSS :

> Mauvaise utilisation

```html
<section class="ctnr">
  <div class="block"></div>
  <form class="form"></form>
  <p class="no-result"></p>
</section>
```

Bonne utilisation

```html
<section class="recipes-cards">
  <div class="recipes-cards__container recipes-cards__container--loading"></div>
  <form class="recipes-cards__filter"></form>
  <p class="recipes-cards__no-results"></p>
</section>
```

L'IA a aidé à :

- Appliquer la méthodologie ABEM pour le nommage des classes
- Structurer correctement les styles SCSS
- Assurer la cohérence avec le design system existant
- Rendre les layouts responsifs

## Compréhension et logique

J'ai également utilisé l'IA pour comprendre certaines logiques et façons de procéder que je ne comprenais pas, notamment :

- Les patterns Vue 3 avec Composition API
- Les queries GROQ pour Sanity CMS
- Certains liens API / FrontEnd

## Travail personnel

La partie suivante a été rédigée par ma personne :

- La logique métier et les composables
- Le typage TypeScript des structures de données
- Le découpage en composants
- L'architecture générale de l'application
