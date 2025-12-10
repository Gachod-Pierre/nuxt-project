<script setup lang="ts">
import type { SanityImageSource } from '@sanity/image-url'

interface Props {
  image?: SanityImageSource;
  alt?: string;
}

defineProps<Props>()

const { urlFor } = useSanityImageUrl()
</script>

<template>
  <section v-if="image" class="hero-banner">
    <img
      :src="urlFor(image, { width: 1200, height: 600 }) ?? ''"
      :alt="alt || 'Hero Banner'"
      class="hero-banner__image"
    >
  </section>
</template>

<style scoped lang="scss">
.hero-banner {
  width: 100%;
  height: 40vh;
  overflow: hidden;

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}
</style>