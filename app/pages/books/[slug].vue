<script setup lang="ts">
import type { SanityBook } from '~/types/cms/book'

const POST_QUERY = groq`*[_type == "book" && slug.current == $slug][0]{ ..., categories[]->{ ... }}`
const { params } = useRoute()

const { data: post } = await useLazySanityQuery<SanityBook>(POST_QUERY, params)
const { urlFor } = useSanityImageUrl()
</script>

<template>
  <main
    v-if="post"
    class="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4"
  >
    <a href="/books" class="hover:underline">&larr; Back to posts</a>
    <img
      v-if="post.cover"
      :src="urlFor(post.cover, { width: 550, height: 310 }) ?? ''"
      :alt="post?.title"
      class="aspect-video rounded-xl"
      width="550"
      height="310"
    >
    <h1 v-if="post.title" class="text-4xl font-bold mb-8">{{ post.title }}</h1>
    <div class="prose">
      <p v-if="post.publishedAt">
        Published: {{ new Date(post.publishedAt).toLocaleDateString() }}
      </p>
      <span
        v-for="category in post.categories"
        :key="category._id"
        class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
      >
        {{ category.label }}
      </span>
      <SanityContent v-if="post.body" :blocks="post.body" />
    </div>
  </main>
</template>