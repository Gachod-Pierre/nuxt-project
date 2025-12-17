<script setup lang="ts">
import type { SanityDocument } from '@sanity/client'

defineProps<{
  books: SanityDocument[];
}>()

const { urlFor } = useSanityImageUrl()
</script>

<template>
  <ul class="my-books-cards">
    <li v-for="book in books" :key="book._id" class="my-books-cards__item">
      <NuxtLink
        :to="`/books/${book.slug.current}`"
        class="my-books-cards__link"
      >
        <div class="my-books-cards__image-wrapper">
          <img
            v-if="book.cover"
            :src="urlFor(book.cover, { width: 550, height: 310 }) ?? ''"
            :alt="book?.title"
            class="my-books-cards__image"
            width="550"
            height="310"
          >
        </div>

        <div class="my-books-cards__content">
          <h2 class="my-books-cards__title">{{ book.title }}</h2>
          <p class="my-books-cards__author">{{ book.author?.name }}</p>
          <p class="my-books-cards__date">
            {{ new Date(book.publishedAt).toLocaleDateString() }}
          </p>
        </div>
      </NuxtLink>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.my-books-cards {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;

  &__item {
    height: 100%;
  }

  &__link {
    display: flex;
    flex-direction: column;
    height: 100%;
    text-decoration: none;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }
  }

  &__image-wrapper {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;

    .my-books-cards__link:hover & {
      transform: scale(1.05);
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 1.5rem;
    gap: 0.5rem;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.4;
    color: var(--color-text);
  }

  &__author {
    font-size: 0.95rem;
    color: var(--color-text-secondary, #666);
    font-weight: 500;
  }

  &__date {
    font-size: 0.85rem;
    color: var(--color-text-tertiary, #999);
    margin-top: auto;
  }
}
</style>
