<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

function toggleMenu () {
  isOpen.value = !isOpen.value
}
</script>

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
        <NuxtLink to="/login" class="header__user">
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

<style scoped lang="scss">

.header {
  background: rgb(244, 244, 244);
  color: white;
  width: 100%;
  position: relative;
  z-index: 50;
  border-bottom: 5px solid rgba(0, 0, 0, 0.1);

  &__container {
    max-width: 1280px;
    margin: auto;
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }


  &__logo img {
    width: 50px;
    height: auto;
    display: block;
  }


  &__nav {
    display: flex;
    gap: 2rem;

    @include medium-down {
    display: none;
  }
  }

  &__link {
    color: black;
    font-weight: 500;
    text-decoration: none;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 0.7;
    }
  }


  &__actions {
    display: flex;
    align-items: center;
    gap: 1.2rem;

    @include medium-down {
    display: none;
  }
  }

  &__user img {
    width: 26px;
    height: 26px;
    cursor: pointer;
  }

  &__burger {
    display: none;
    background: none;
    border: none;
    padding: 0.3rem;
    cursor: pointer;

    @include medium-down {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    span {
      width: 28px;
      height: 3px;
      background: white;
      border-radius: 5px;
      transition: 0.3s ease;

      &.is-open:nth-child(1) {
        transform: translateY(9px) rotate(45deg);
      }
      &.is-open:nth-child(2) {
        opacity: 0;
      }
      &.is-open:nth-child(3) {
        transform: translateY(-9px) rotate(-45deg);
      }
    }
  }

  &__mobile-menu {
    display: flex;
    flex-direction: column;
    background: #111;
    padding: 1rem 1.5rem;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    gap: 1rem;
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;

    &.is-open {
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    }
  }

  &__mobile-link {
    color: white;
    text-decoration: none;
    font-size: 1.1rem;
    padding: 0.8rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      opacity: 0.7;
    }
  }
}
</style>