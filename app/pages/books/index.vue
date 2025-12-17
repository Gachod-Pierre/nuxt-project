<script setup lang="ts">
import type { SanityDocument } from '@sanity/client'

const POSTS_QUERY = groq`*[
  _type == "book"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, cover, publishedAt, author->{ name } }`

const { data: posts } = await useLazySanityQuery<SanityDocument[]>(POSTS_QUERY)
const books = computed(() => posts.value ?? [])
</script>

<template>
  <main class="books-page">
    <div class="books-page__header">
      <h1 class="books-page__title">Livres</h1>
    </div>

    <div class="books-page__content">
      <MyBooksCards :books="books" />
    </div>
  </main>
</template>

<style lang="scss" scoped>
.books-page {
  min-height: 100vh;
  padding: 6rem 4rem 4rem 4rem;
  background: var(--color-background);

  &__header {
    margin-bottom: 3rem;
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: 1rem;
  }

  &__content {
    display: flex;
    flex-direction: column;
  }
}
</style>
