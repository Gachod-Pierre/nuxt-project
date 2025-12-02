<script setup lang="ts">
const config = useRuntimeConfig();

const { data: recipes, error } = useAsyncData("recipes", async () => {
  const { data } = await $fetch<ApiResponse<Recipe[]>>(
    `${config.public.apiUrl}/recipes`
  );
  return data;
});

const { data: cuisines } = useAsyncData("cuisines", async () => {
  const { data } = await $fetch<ApiResponse<Cuisine[]>>(
    `${config.public.apiUrl}/cuisines`
  );
  return data;
});

console.log(error);
if (error && error.value) throw new Error("Failed to fetch recipes");

const filters = ref<Cuisine["name"][]>([]);

function onCheckboxInput($event: InputEvent) {
  const target = $event.target;
  if (!(target instanceof HTMLInputElement)) return;

  filters.value = target.checked
    ? [...filters.value, target.value]
    : filters.value.filter((f: string) => f !== target.value);
  console.log(filters.value);
}

const filteredRecipes = computed<Recipe[]>(() => {
  if (!recipes.value) return []
  if (!filters.value.length) return recipes.value
  return recipes.value.filter(recipe => filters.value.includes(recipe.cuisine_name))
});   
</script>

<template>
  <div>
    <div class="recipes-filters">
      active filters : {{ filters }}
      <div v-for="cuisine in cuisines" :key="cuisine.cuisine_id">
        <input
          id="cuisine.name"
          type="checkbox"
          :value="cuisine.name"
          @input="onCheckboxInput"
        >
        <label for="cuisine.name">{{ cuisine.name }}</label>
      </div>
    </div>
    <div class="recipes-grid">
      Liste des recettes
      <ul>
        <li v-for="recipe in filteredRecipes" :key="recipe.recipe_id">
          <NuxtLink :to="`/recipes/${recipe.recipe_id}`">{{
            recipe.title
          }}</NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
