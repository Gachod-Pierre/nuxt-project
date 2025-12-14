<script setup lang="ts">
const config = useRuntimeConfig()

const [{ data: recipes, error }, { data: cuisines }] = await Promise.all([
  useAsyncData('recipes', async () => {
    const { data } = await $fetch<ApiResponse<Recipe[]>>(
      `${config.public.apiUrl}/recipes`
    )
    return data
  }),
  useAsyncData('cuisines', async () => {
    const { data } = await $fetch<ApiResponse<Cuisine[]>>(
      `${config.public.apiUrl}/cuisines`
    )
    return data
  })
])

// eslint-disable-next-line no-console
console.log(error)
if (error && error.value) throw new Error('Failed to fetch recipes')

const page = ref(2)
const perPage = 2

const search = ref<string>('')
const filters = ref<Cuisine['name'][]>([])

const filteredRecipes = computed<Recipe[]>(() => {
  if (!recipes.value) return []

  let result = recipes.value

  if (search.value.trim().length > 0) {
    const keyword = search.value.toLowerCase().trim()
    result = result.filter((recipe) =>
      recipe.title.toLowerCase().includes(keyword)
    )
  }

  if (filters.value.length > 0) {
    result = result.filter((recipe) =>
      filters.value.includes(recipe.cuisine_name)
    )
  }

  return result
})

watch([filters, search], () => {
  page.value = 1
})

const displayedRecipes = computed<Recipe[]>(() => {
  const start = (page.value - 1) * perPage
  const end = start + perPage
  return filteredRecipes.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredRecipes.value.length / perPage)
})
</script>

<template>
  <section class="recipes">
    <!-- FILTRES -->
    <div class="recipes-filters">
      <MySearchBar v-model="search" />
      <MyFiltersPanel v-if="cuisines" v-model="filters" :cuisines="cuisines" />
      <MyPagination v-model="page" :total-pages="totalPages" />
    </div>

    <!-- GRID RECETTES -->
    <div class="recipes-grid">
      <MyTitle :level="2" size="lg" weight="bold" class="recipes-grid__title">
        Liste des recettes
      </MyTitle>

      <ul class="recipes-grid__list">
        <li
          v-for="recipe in displayedRecipes"
          :key="recipe.recipe_id"
          class="recipes-grid__item"
        >
          <MyRecipesCard :recipe="recipe" />
        </li>
      </ul>
    </div>
  </section>
</template>

<style lang="scss" scoped>
/* ===========================
   FILTRES
=========================== */
.recipes-filters {
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ===========================
   GRID DE RECETTES
=========================== */
.recipes-grid {
  margin-bottom: 2rem;
  padding: 1rem;
  border-radius: 8px;

  &__title {
    margin-bottom: 1.5rem;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
    padding: 0;
    list-style: none;
  }

  &__item {
    display: flex;
  }
}
</style>
