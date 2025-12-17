<script setup lang="ts">
import { useRecipeFormValidation } from '~/composables/useRecipeFormValidation'
import { useRecipeFormSubmit } from '~/composables/useRecipeFormSubmit'

const config = useRuntimeConfig()
const token = useCookie('my_token')

const {
  title,
  description,
  imageUrl,
  cuisineId,
  goalId,
  dietId,
  allergyId,
  recipeIngredients,
  recipeInstructions,
  fieldErrors,
  isFormValid,
  validateIngredients,
  resetForm
} = useRecipeFormValidation()

const {
  loading,
  successMessage,
  errorMessage,
  handleSubmit: submitForm
} = useRecipeFormSubmit()

const [
  { data: cuisines },
  { data: goals },
  { data: diets },
  { data: allergies },
  { data: ingredients }
] = await Promise.all([
  useAsyncData('cuisines', () =>
    $fetch<ApiResponse<Cuisine[]>>(`${config.public.apiUrl}/cuisines`).then(
      (r) => r.data
    )
  ),
  useAsyncData('goals', () =>
    $fetch<ApiResponse<Goal[]>>(`${config.public.apiUrl}/goals`).then(
      (r) => r.data
    )
  ),
  useAsyncData('dietaryInformation', () =>
    $fetch<ApiResponse<Diet[]>>(
      `${config.public.apiUrl}/dietaryInformations`
    ).then((r) => r.data)
  ),
  useAsyncData('allergiesInformation', () =>
    $fetch<ApiResponse<Allergy[]>>(
      `${config.public.apiUrl}/allergiesInformations`
    ).then((r) => r.data)
  ),
  useAsyncData('ingredients', () =>
    $fetch<ApiResponse<Ingredient[]>>(
      `${config.public.apiUrl}/ingredients`
    ).then((r) => r.data)
  )
])

async function handleSubmit () {
  if (!isFormValid.value) {
    errorMessage.value = 'Veuillez remplir tous les champs obligatoires.'
    return
  }

  const ingredientError = validateIngredients()
  if (ingredientError) {
    errorMessage.value = ingredientError
    return
  }

  await submitForm(
    config,
    token,
    {
      title: title.value,
      description: description.value,
      imageUrl: imageUrl.value,
      cuisineId: cuisineId.value,
      goalId: goalId.value,
      dietId: dietId.value,
      allergyId: allergyId.value,
      ingredients: recipeIngredients.value,
      instructions: recipeInstructions.value
    },
    resetForm
  )
}
</script>

<template>
  <section class="recipes-form">
    <MyTitle :level="2" size="lg" weight="bold">Créer une recette</MyTitle>

    <form class="recipes-form__form" @submit.prevent="handleSubmit">
      <div class="recipes-form__group">
        <MyInput
          v-model="title"
          label="Titre *"
          placeholder="Titre de la recette"
          :color="fieldErrors.title ? 'error' : 'default'"
          required
        />
      </div>

      <div class="recipes-form__group">
        <MyInput
          v-model="description"
          label="Description *"
          placeholder="Décris ta recette..."
          :color="fieldErrors.description ? 'error' : 'default'"
          required
        />
      </div>

      <div class="recipes-form__group">
        <MyInput
          v-model="imageUrl"
          label="Image URL"
          placeholder="ex: poulet.jpg"
        />
      </div>

      <div class="recipes-form__group">
        <label class="recipes-form__label">Cuisine *</label>
        <select
          v-model="cuisineId"
          class="recipes-form__select"
          :class="{ 'recipes-form__select--error': fieldErrors.cuisine }"
          required
        >
          <option disabled value="">Sélectionner une cuisine</option>
          <option
            v-for="c in cuisines"
            :key="c.cuisine_id"
            :value="c.cuisine_id"
          >
            {{ c.name }}
          </option>
        </select>
      </div>

      <div class="recipes-form__group">
        <label class="recipes-form__label">Objectif *</label>
        <select
          v-model="goalId"
          class="recipes-form__select"
          :class="{ 'recipes-form__select--error': fieldErrors.goal }"
          required
        >
          <option disabled value="">Sélectionner un objectif</option>
          <option v-for="g in goals" :key="g.goal_id" :value="g.goal_id">
            {{ g.name }}
          </option>
        </select>
      </div>

      <div class="recipes-form__group">
        <label class="recipes-form__label">Régime</label>
        <select v-model="dietId" class="recipes-form__select">
          <option value="">Aucun</option>
          <option v-for="d in diets" :key="d.diet_id" :value="d.diet_id">
            {{ d.name }}
          </option>
        </select>
      </div>

      <div class="recipes-form__group">
        <label class="recipes-form__label">Allergie</label>
        <select v-model="allergyId" class="recipes-form__select">
          <option value="">Aucune</option>
          <option
            v-for="a in allergies"
            :key="a.allergy_id"
            :value="a.allergy_id"
          >
            {{ a.name }}
          </option>
        </select>
      </div>

      <MyRecipesIngredientsPanel
        v-model="recipeIngredients"
        :ingredients="ingredients"
        @error="(msg: string) => (errorMessage = msg)"
        @success="(msg: string) => (successMessage = msg)"
      />

      <MyRecipesInstructionsPanel
        v-model="recipeInstructions"
        @error="(msg: string) => (errorMessage = msg)"
      />

      <MyButton
        class="recipes-form__button"
        :disabled="loading || !isFormValid"
        size="medium"
      >
        {{ loading ? "Création..." : "Créer la recette" }}
      </MyButton>
    </form>

    <p v-if="successMessage" class="recipes-form__success">
      {{ successMessage }}
    </p>
    <p v-if="errorMessage" class="recipes-form__error">{{ errorMessage }}</p>
  </section>
</template>

<style scoped lang="scss">
.recipes-form {
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1.4rem;
  }

  &__group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  &__label {
    font-weight: 600;
    font-size: 0.95rem;
  }

  &__select {
    padding: 0.6rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 0.95rem;
    background: white;

    &--error {
      border-color: #d0342c;
      background: #ffeaea;
    }
  }

  &__button {
    margin-top: 0.8rem;
    align-self: flex-start;
  }

  &__success {
    color: #2b8a3e;
    font-weight: 600;
  }

  &__error {
    color: #c52121;
    font-weight: 600;
  }
}
</style>
