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

function onPageClick (n: number) {
  page.value = n
}

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
      <br >
      pages : {{ page }} / {{ totalPages }}
      <div class="pages">
        <span v-for="n in totalPages" :key="n" @click="onPageClick(n)">{{
          n
        }}</span>
      </div>
    </div>

    <!-- GRID RECETTES -->
    <div class="recipes-grid">
      <h2 class="recipes-grid__title">Liste des recettes</h2>

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
.pages {
  span {
    cursor: pointer;
    margin-right: 0.5rem;
    padding: 0.2rem 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;

    &:hover {
      background-color: #f0f0f0;
    }
  }
}

/* ===========================
   FILTRES
=========================== */
.recipes-filters {
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
  &__info {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding: 1rem;
  }

  &__title {
    font-size: 1.3rem;
    font-weight: 700;
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
    flex-direction: column;
    gap: 0.5rem;
    // padding: 1rem;
    background: transparent;
    border-radius: 0;
    box-shadow: none;
    transition: none;

    &:hover {
      transform: none;
    }
  }

  &__image {
    display: none;
  }

  &__cuisine {
    display: none;
  }

  &__title-link {
    display: none;
  }
}
</style>
