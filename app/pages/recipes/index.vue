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

function onCheckboxInput ($event: InputEvent) {
  const target = $event.target
  if (!(target instanceof HTMLInputElement)) return
  filters.value = target.checked
    ? [...filters.value, target.value]
    : filters.value.filter((f: string) => f !== target.value)
  // eslint-disable-next-line no-console
  console.log(filters.value)
}

function onPageClick (n: number) {
  page.value = n
}

const filteredRecipes = computed<Recipe[]>(() => {
  if (!recipes.value) return []

  let result = recipes.value

  if (search.value.trim().length > 0) {
    const keyword = search.value.toLowerCase().trim()
    result = result.filter(recipe =>
      recipe.title.toLowerCase().includes(keyword)
    )
  }

  if (filters.value.length > 0) {
    result = result.filter(recipe =>
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
      <input v-model="search" type="text">
      <br>
      search : {{ search }}
      <h2 class="recipes-filters__title">Active filters: {{ filters }}</h2>
      <br>
      pages : {{ page }} / {{ totalPages }}
      <div class="pages"><span v-for="n in totalPages" :key="n" @click="onPageClick(n)">{{ n }}</span></div>
      <div 
        v-for="cuisine in cuisines" 
        :key="cuisine.cuisine_id" 
        class="recipes-filters__item"
      >
        <input
          :id="`cuisine-${cuisine.name}`"
          type="checkbox"
          :value="cuisine.name"
          class="recipes-filters__checkbox"
          @input="onCheckboxInput"
        >

        <label 
          :for="`cuisine-${cuisine.name}`" 
          class="recipes-filters__label"
        >
          {{ cuisine.name }}
        </label>
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
          <NuxtImg 
            :src="`/recipes/${recipe.image_url}`" 
            class="recipes-grid__image"
            alt=""
          />

          <div class="recipes-grid__info">
            <span class="recipes-grid__cuisine">
              {{ recipe.cuisine_name }}
            </span>
            <NuxtLink
              :to="`/recipes/${recipe.recipe_id}`"
              class="recipes-grid__title-link"
            >
              {{ recipe.title }}
            </NuxtLink>
          </div>
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

  .recipes-filters__item {
    display: flex;
    flex-direction: row;     // input + label en ligne → OK
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.6rem;
}

  &__title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  &__checkbox {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  &__label {
    cursor: pointer;
    font-size: 0.95rem;
  }
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
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-4px);
    }
  }

  &__image {
    width: 100%;
    height: 160px;
    object-fit: cover;
    border-radius: 8px;
  }

  &__cuisine {
    font-size: 0.85rem;
    color: #666;
  }

  &__title-link {
    margin-top: auto;
    font-size: 1.1rem;
    font-weight: 600;
    text-decoration: none;
    color: #222;
    transition: color 0.2s ease;

    &:hover {
      color: #0070f3;
    }
  }
}


</style>
