<script setup lang="ts">
import type { SanityHomePage } from '~/types/cms/homePage'

const config = useRuntimeConfig()

const HOME_PAGE_QUERY = groq`*[_type == "homePage"][0]{
  title,
  subtitle,
  seoTitle,
  description,
  heroBanner
}`

const [{ data: homePage }, { data: recipes }] = await Promise.all([
  useLazySanityQuery<SanityHomePage>(HOME_PAGE_QUERY),
  useAsyncData('recent-recipes', async () => {
    const { data } = await $fetch<ApiResponse<Recipe[]>>(
      `${config.public.apiUrl}/recipes`
    )
    return data
  })
])

const recentRecipes = computed<Recipe[]>(() => {
  if (!recipes.value) return []
  return [...recipes.value].sort((a, b) => b.recipe_id - a.recipe_id).slice(0, 3)
})
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

    <!-- Recent Recipes Section -->
    <section class="recent-recipes">
      <div class="recent-recipes__container">
        <MyTitle
          :level="2"
          size="lg"
          weight="bold"
          class="recent-recipes__title"
        >
          Les dernières recettes
        </MyTitle>

        <ul class="recent-recipes__grid">
          <li
            v-for="recipe in recentRecipes"
            :key="recipe.recipe_id"
            class="recent-recipes__item"
          >
            <MyRecipesCard :recipe="recipe" />
          </li>
        </ul>

        <div class="recent-recipes__cta">
          <MyButton href="/recipes" variant="default">
            Voir toutes les recettes
          </MyButton>
        </div>
      </div>
    </section>
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

/* ===========================
   RECENT RECIPES SECTION
=========================== */
.recent-recipes {
  padding: 2rem;

  &__title {
    margin-bottom: 2rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, 280px);
    gap: 1.5rem;
    padding: 0;
    list-style: none;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: repeat(auto-fit, 260px);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
  }

  &__item {
    display: flex;
  }

  &__cta {
    display: flex;
  }
}
</style>
