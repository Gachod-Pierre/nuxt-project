<script setup lang="ts">
import type { SanitySiteSettings } from '~/types/cms/siteSettings'

defineProps<{
  logo: SanitySiteSettings['logo'];
  navigation: SanitySiteSettings['navigation'];
}>()

const { urlFor } = useSanityImageUrl()
</script>

<template>
  <footer class="footer">
    <div class="footer__container">
      <!-- Logo Section -->
      <div class="footer__logo">
        <img
          v-if="logo"
          :src="urlFor(logo) || ''"
          alt=""
          class="footer__logo-image"
        >
      </div>

      <!-- Navigation Section -->
      <nav v-if="navigation?.length" class="footer__nav">
        <ul class="footer__nav-list">
          <li
            v-for="item in navigation"
            :key="item.url"
            class="footer__nav-item"
          >
            <NuxtLink :to="item.url" class="footer__nav-link">
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Footer Bottom -->
    <div class="footer__bottom">
      <p class="footer__copyright">
        &copy; {{ new Date().getFullYear() }} All rights reserved.
      </p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  background-color: #1a1a1a;
  color: #fff;
  padding: 3rem 1rem 1rem;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: flex-start;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  &__logo {
    display: flex;
    align-items: center;
  }

  &__logo-image {
    max-width: 150px;
    height: auto;
    filter: brightness(0) invert(1);

    @media (max-width: 768px) {
      max-width: 120px;
    }
  }

  &__nav {
    width: 100%;
    justify-self: end;

    @media (max-width: 768px) {
      justify-self: start;
    }
  }

  &__nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: flex-end;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 0.75rem;
      justify-content: flex-start;
    }
  }

  &__nav-link {
    color: #fff;
    text-decoration: none;
    transition: color 0.3s ease;
    font-size: 0.95rem;

    &:hover {
      color: #00d4ff;
    }

    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }

  &__bottom {
    max-width: 1200px;
    margin: 0 auto;
    border-top: 1px solid #333;
    padding-top: 1rem;
    text-align: center;
  }

  &__copyright {
    margin: 0;
    font-size: 0.85rem;
    color: #999;
  }
}
</style>
