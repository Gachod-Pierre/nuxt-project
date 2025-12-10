<script setup lang="ts">
import type { SanitySiteSettings } from '~/types/cms/siteSettings'

// request for Sanity siteSettings

const query = groq`*[_type == "siteSettings"][0]`

const { data } = await useLazySanityQuery<SanitySiteSettings>(query)

// ... champs seo remplis depuis Sanity
</script>

<template>
  <div class="layout-default">
    <my-header v-if="data" v-bind="{ navigation: data.navigation, logo: data.logo }"/>
    <main class="layout-default__main">
      <slot />
    </main>
    <my-footer v-if="data" v-bind="{ navigation: data.navigation, logo: data.logo }"/>
  </div>
</template>
