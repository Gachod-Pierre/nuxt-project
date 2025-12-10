<script setup lang="ts">
import type { SanityHomePage } from '~/types/cms/homePage'

const HOME_PAGE_QUERY = groq`*[_type == "homePage"][0]{
  title,
  subtitle,
  seoTitle,
  description,
  heroBanner
}`

const { data: homePage } = await useLazySanityQuery<SanityHomePage>(HOME_PAGE_QUERY)
</script>

<template>
  <div v-if="homePage">
    <!-- Hero Banner -->
    <MyHero :image="homePage.heroBanner" :alt="homePage.title" />

    <!-- Content -->
    <div class="homepage">
      <MyTitle :level="1" size="xl">{{ homePage.title }}</MyTitle>
      <p v-if="homePage.subtitle" class="homepage__subtitle">
        {{ homePage.subtitle }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.homepage {
  padding: 2rem;

  &__subtitle {
    margin-top: 1rem;
    font-size: 1.25rem;
  }
}
</style>