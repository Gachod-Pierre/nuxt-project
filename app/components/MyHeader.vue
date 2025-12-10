<script setup lang="ts">
import type { SanitySiteSettings } from '~/types/cms/siteSettings'

defineProps<{
  logo: SanitySiteSettings['logo'];
  navigation: SanitySiteSettings['navigation'];
}>()

const { urlFor } = useSanityImageUrl()

const isOpen = ref(false)
const token = useCookie('my_token')

function toggleMenu () {
  isOpen.value = !isOpen.value
}

const user = computed(() => {
  if (!token.value) {
    return null
  }

  try {
    const tokenValue = token.value
    const payload =
      tokenValue && tokenValue.split('.')[1]
        ? JSON.parse(atob(tokenValue.split('.')[1] || ''))
        : null
    return {
      username: payload.username,
      user_id: payload.user_id
    }
  } catch {
    return null
  }
})

</script>

<template>
  <header class="header">
    <div class="header__container">
      <NuxtLink to="/" class="header__logo">
        <img v-if="logo" :src="urlFor(logo) || ''" alt="" >
      </NuxtLink>

      <nav class="header__nav">
        <ul class="header__nav-list">
          <li
            v-for="item in navigation"
            :key="item.url"
            class="header__nav-item"
          >
            <NuxtLink :to="item.url" class="header__nav-link">
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="header__actions">
        <NuxtLink v-if="user" to="/dashboard" class="header__link">
          Bonjour {{ user.username }}
        </NuxtLink>
        <MyButton v-else :disabled="true" href="/login"> se connecter </MyButton>
      </div>

      <button class="header__burger" aria-label="Menu" @click="toggleMenu">
        <span :class="{ 'is-open': isOpen }" />
        <span :class="{ 'is-open': isOpen }" />
        <span :class="{ 'is-open': isOpen }" />
      </button>
    </div>

    <div class="header__mobile-menu" :class="{ 'is-open': isOpen }">
      <nav class="header__mobile-nav">
        <ul class="header__mobile-list">
          <li
            v-for="item in navigation"
            :key="item.url"
            class="header__mobile-item"
          >
            <NuxtLink
              :to="item.url"
              class="header__mobile-link"
              @click="toggleMenu"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="header__mobile-actions">
        <NuxtLink
          v-if="user"
          to="/dashboard"
          class="header__mobile-link"
          @click="toggleMenu"
        >
          Bonjour {{ user.username }}
        </NuxtLink>
        <NuxtLink
          v-else
          to="/login"
          class="header__mobile-link"
          @click="toggleMenu"
        >
          se connecter
        </NuxtLink>
      </div>
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
    width: 150px;
    height: auto;
    display: block;
  }

  &__nav {
    @include medium-down {
      display: none;
    }
  }

  &__nav-list {
    display: flex;
    gap: 2rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &__nav-item {
    display: flex;
    align-items: center;
  }

  &__nav-link {
    color: black;
    font-weight: 500;
    text-decoration: none;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.7;
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

  &__user {
    color: black;
    font-weight: 500;
    text-decoration: none;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.7;
    }

    img {
      width: 26px;
      height: 26px;
      cursor: pointer;
    }
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
      background: black;
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
    transition: opacity 0.3s ease, transform 0.3s ease;

    &.is-open {
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    }
  }

  &__mobile-nav {
    flex: 1;
  }

  &__mobile-list {
    display: flex;
    flex-direction: column;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 0;
  }

  &__mobile-item {
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    &:last-child {
      border-bottom: none;
    }
  }

  &__mobile-link {
    color: white;
    text-decoration: none;
    font-size: 1.1rem;
    padding: 0.8rem 0;
    width: 100%;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.7;
    }
  }

  &__mobile-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    .header__mobile-link {
      padding: 0.8rem 0;
      border-bottom: none;
    }
  }
}
</style>
