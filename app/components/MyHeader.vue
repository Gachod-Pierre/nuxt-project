

<template>
  <header class="header">
    <div class="header__container">

      <NuxtLink to="/" class="header__logo">
        <img src="/logo.png" alt="Logo">
      </NuxtLink>

      <nav class="header__nav">
        <NuxtLink to="/" class="header__link">Accueil</NuxtLink>
        <NuxtLink to="/recipes" class="header__link">Recettes</NuxtLink>
        <NuxtLink to="/about" class="header__link">À propos</NuxtLink>
      </nav>

      <div class="header__actions">
        <NuxtLink to="/account" class="header__user">
          <img src="/icons/user.png" alt="Mon compte">
        </NuxtLink>
      </div>

      <button class="header__burger" aria-label="Menu" @click="toggleMenu">
        <span :class="{ 'is-open': isOpen }"/>
        <span :class="{ 'is-open': isOpen }"/>
        <span :class="{ 'is-open': isOpen }"/>
      </button>

    </div>


    <div class="header__mobile-menu" :class="{ 'is-open': isOpen }">
      <NuxtLink to="/" class="header__mobile-link" @click="toggleMenu">Accueil</NuxtLink>
      <NuxtLink to="/recipes" class="header__mobile-link" @click="toggleMenu">Recettes</NuxtLink>
      <NuxtLink to="/about" class="header__mobile-link" @click="toggleMenu">À propos</NuxtLink>
      <NuxtLink to="/account" class="header__mobile-link" @click="toggleMenu">Mon compte</NuxtLink>
    </div>
  </header>
</template>

