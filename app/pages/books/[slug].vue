<script setup lang="ts">
import type { SanityBook } from '~/types/cms/book'

const POST_QUERY = groq`*[_type == "book" && slug.current == $slug][0]{ ..., body[], categories[]->{ ... }}`
const { params } = useRoute()

const { data: post } = await useLazySanityQuery<SanityBook>(POST_QUERY, params)
const { urlFor } = useSanityImageUrl()
</script>

<template>
  <main v-if="post" class="book-detail">
    <div class="book-detail__header">
      <NuxtLink
        to="/books"
        class="book-detail__back-link"
      >&larr; Retour aux livres</NuxtLink
      >
    </div>

    <div class="book-detail__container">
      <aside class="book-detail__sidebar">
        <img
          v-if="post.cover"
          :src="urlFor(post.cover, { width: 550, height: 310 }) ?? ''"
          :alt="post?.title"
          class="book-detail__image"
          width="550"
          height="310"
        >
      </aside>

      <article class="book-detail__content">
        <h1 v-if="post.title" class="book-detail__title">{{ post.title }}</h1>

        <div class="book-detail__meta">
          <p v-if="post.publishedAt" class="book-detail__date">
            Publié le
            {{ new Date(post.publishedAt).toLocaleDateString("fr-FR") }}
          </p>

          <div v-if="post.categories" class="book-detail__categories">
            <span
              v-for="category in post.categories"
              :key="category._id"
              class="book-detail__category-tag"
            >
              {{ category.label }}
            </span>
          </div>
        </div>

        <div v-if="post.body" class="book-detail__body">
          <p v-for="block in post.body" :key="block._key">
            <span
              v-for="child in block.children"
              :key="child._key"
              :class="{
                'font-bold': child.marks?.includes('strong'),
                italic: child.marks?.includes('em'),
              }"
            >
              {{ child.text }}
            </span>
          </p>
        </div>
      </article>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.book-detail {
  min-height: 100vh;
  background: var(--color-background);
  padding: 4rem;

  &__header {
    max-width: 1200px;
    margin: 0 auto 3rem;
  }

  &__back-link {
    display: inline-block;
    color: var(--color-text);
    text-decoration: none;
    font-size: 0.95rem;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.7;
    }
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 4rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  &__sidebar {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media (max-width: 768px) {
      order: -1;
    }
  }

  &__image {
    width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    object-fit: cover;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-text);
    line-height: 1.3;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  &__date {
    font-size: 0.95rem;
    color: var(--color-text-secondary, #666);
    margin: 0;
  }

  &__categories {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  &__category-tag {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: #f0f0f0;
    color: var(--color-text);
    border-radius: 24px;
    font-size: 0.85rem;
    font-weight: 500;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #e0e0e0;
    }
  }

  &__body {
    font-size: 1rem;
    line-height: 1.8;
    color: var(--color-text);

    & :deep(p) {
      margin-bottom: 1.5rem;
    }

    & :deep(h2) {
      font-size: 1.75rem;
      font-weight: 600;
      margin: 2rem 0 1rem;
      color: var(--color-text);
    }

    & :deep(h3) {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 1.5rem 0 0.75rem;
      color: var(--color-text);
    }

    & :deep(ul),
    & :deep(ol) {
      margin-bottom: 1.5rem;
      padding-left: 2rem;
    }

    & :deep(li) {
      margin-bottom: 0.5rem;
    }

    & :deep(a) {
      color: #0066cc;
      text-decoration: underline;
      transition: opacity 0.3s ease;

      &:hover {
        opacity: 0.8;
      }
    }

    & :deep(blockquote) {
      padding-left: 1.5rem;
      border-left: 4px solid #ccc;
      margin: 1.5rem 0;
      font-style: italic;
      color: var(--color-text-secondary, #666);
    }

    & :deep(img) {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 2rem 0;
    }
  }
}
</style>
