<template>
  <section class="dashboard">
    <!-- HEADER -->
    <div class="dashboard__header-top">
      <MyTitle :level="1" size="xl" weight="bold"> Dashboard </MyTitle>
      <MyButton @click="onLogoutClick"> Se déconnecter </MyButton>
    </div>

    <!-- MES RECETTES -->
    <div class="dashboard__section">
      <div class="dashboard__section-header">
        <MyTitle :level="2" size="lg" weight="bold"> Mes recettes </MyTitle>
      </div>

      <!-- FILTRES -->
      <div class="dashboard__filters">
        <MySearchBar v-model="search" />
        <MyFiltersPanel
          v-if="cuisines"
          v-model="filters"
          :cuisines="cuisines"
        />
        <MyPagination v-model="page" :total-pages="totalPages" />
      </div>

      <!-- CONTENU -->
      <div v-if="recipes && recipes.length > 0" class="dashboard__grid">
        <ul class="dashboard__list">
          <li
            v-for="recipe in displayedRecipes"
            :key="recipe.recipe_id"
            class="dashboard__item"
          >
            <MyRecipesCard :recipe="recipe" />
          </li>
        </ul>
      </div>

      <!-- VIDE -->
      <div v-else class="dashboard__empty">
        <p class="dashboard__empty-text">
          Vous n'avez pas encore créé de recettes.
        </p>
        <NuxtLink to="/recipes/create" class="dashboard__empty-link">
          Créer votre première recette
        </NuxtLink>
      </div>
    </div>

    <!-- FORMULAIRE CRÉATION -->
    <div class="dashboard__section dashboard__section--form">
      <div class="dashboard__form-container">
        <div class="dashboard__form-image">
          <img
            src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=400&fit=crop"
            alt="Créer une recette"
            class="dashboard__form-image-img"
          >
        </div>
        <div class="dashboard__form-content">
          <MyRecipesForm />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const config = useRuntimeConfig()
const token = useCookie('my_token')

function onLogoutClick () {
  token.value = null
  return navigateTo('/login')
}

const [{ data: recipes, error }, { data: cuisines }] = await Promise.all([
  useAsyncData('my-recipes', async () => {
    const { data } = await $fetch<ApiResponse<Recipe[]>>(
      `${config.public.apiUrl}/recipes/my-recipes`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      }
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

if (error && error.value) throw new Error('Failed to fetch my recipes')

const page = ref(1)
const perPage = 10

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

watch([search, filters], () => {
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

<style lang="scss" scoped>
/* ===========================
   DASHBOARD
=========================== */
.dashboard {
  padding: 2rem 1rem;
  min-height: 100vh;
}

.dashboard__header-top {
  max-width: 1200px;
  margin: 0 auto 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @include medium-down {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}

.dashboard__section {
  max-width: 1200px;
  margin: 0 auto 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  @include medium-down {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}

/* ===========================
   FILTRES
=========================== */
.dashboard__filters {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 8px;
}

/* ===========================
   GRILLE DE RECETTES
=========================== */
.dashboard__grid {
  display: flex;
  flex-direction: column;
}

.dashboard__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.dashboard__item {
  display: flex;
}

/* ===========================
   ÉTAT VIDE
=========================== */
.dashboard__empty {
  max-width: 600px;
  margin: 2rem auto;
  padding: 3rem 2rem;
  text-align: center;
  background: #f9f9f9;
  border-radius: 12px;
  border: 2px dashed #e5e7eb;
}

.dashboard__empty-text {
  font-size: 1.1rem;
  color: #666;
  margin: 0 0 1.5rem;
}

.dashboard__empty-link {
  display: inline-block;
  padding: 0.8rem 1.6rem;
  background: #0070f3;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0055cc;
  }
}

/* ===========================
   SECTION FORMULAIRE
=========================== */
.dashboard__section--form {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #e5e7eb;
}

.dashboard__form-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;

  @include medium-down {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.dashboard__form-image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
  border-radius: 8px;
  overflow: hidden;
  background: #f9f9f9;

  @include medium-down {
    min-height: 300px;
  }
}

.dashboard__form-image-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dashboard__form-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
</style>
