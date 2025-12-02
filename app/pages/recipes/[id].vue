<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()
const { id } = route.params

const { data: recipe, error } = useAsyncData(
  `recipe-${route.params.recipe_id}`,
  async () => {
    const { data } = await $fetch<ApiResponse<FullRecipe>>(
      `${config.public.apiUrl}/recipes/${id}`
    )
    return data
  }
)
if (error && error.value) throw new Error('Failed to fetch recipe')
</script>

<template>
  <div>
    <h1>Page de détail d'une recette</h1>
    <div v-if="recipe">
      <h2>{{ recipe.title }}</h2>
      <p>{{ recipe.description }}</p>
      <h3>Ingrédients :</h3>
      <ul>
        <li
          v-for="ingredient in recipe.ingredients"
          :key="ingredient.ingredient_id"
        >
          {{ ingredient.quantity }} {{ ingredient.unit }} de
          {{ ingredient.name }}
        </li>
      </ul>
      <h3>Instructions :</h3>
      <ol>
        <li v-for="(step, index) in recipe.instructions" :key="index">
          {{ step.step_number }}. {{ step.description }}
        </li>
      </ol>
    </div>
  </div>
</template>
