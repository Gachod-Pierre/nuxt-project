<script setup lang="ts">
import { useRecipeFormValidation } from '~/composables/useRecipeFormValidation'
import { useRecipeFormEdit } from '~/composables/useRecipeFormEdit'

const route = useRoute()
const config = useRuntimeConfig()
const token = useCookie('my_token')

const { data: recipe } = await useAsyncData(
  `recipe-${route.params.id}`,
  async () => {
    const { data } = await $fetch<ApiResponse<FullRecipe>>(
      `${config.public.apiUrl}/recipes/${route.params.id}`
    )
    return data
  }
)

if (!recipe.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Recette non trouvée'
  })
}

const { data: user } = await useAsyncData('current-user', async () => {
  if (!token.value) {
    return null
  }

  try {
    const response = await $fetch<ApiResponse<User>>(
      `${config.public.apiUrl}/users/profile`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      }
    )
    return response.data
  } catch {
    return null
  }
})

const isOwner = computed(() => {
  return (
    user.value && recipe.value && user.value.user_id === recipe.value.user_id
  )
})

const isDeleting = ref(false)
const isEditing = ref(false)

// Form state for editing
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
  isFormValid,
  validateIngredients
} = useRecipeFormValidation()

const {
  loading: editLoading,
  successMessage: editSuccess,
  errorMessage: editError,
  handleEdit
} = useRecipeFormEdit()

const { data: cuisines } = await useAsyncData('cuisines', () =>
  $fetch<ApiResponse<Cuisine[]>>(`${config.public.apiUrl}/cuisines`).then(
    (r) => r.data
  )
)

const { data: goals } = await useAsyncData('goals', () =>
  $fetch<ApiResponse<Goal[]>>(`${config.public.apiUrl}/goals`).then(
    (r) => r.data
  )
)

const { data: diets } = await useAsyncData('dietaryInformation', () =>
  $fetch<ApiResponse<Diet[]>>(
    `${config.public.apiUrl}/dietaryInformations`
  ).then((r) => r.data)
)

const { data: allergies } = await useAsyncData('allergiesInformation', () =>
  $fetch<ApiResponse<Allergy[]>>(
    `${config.public.apiUrl}/allergiesInformations`
  ).then((r) => r.data)
)

const { data: ingredients } = await useAsyncData('ingredients', () =>
  $fetch<ApiResponse<Ingredient[]>>(`${config.public.apiUrl}/ingredients`).then(
    (r) => r.data
  )
)

// Initialize form with recipe data
function initEditForm () {
  title.value = recipe.value?.title || ''
  description.value = recipe.value?.description || ''
  imageUrl.value = recipe.value?.image_url || ''
  cuisineId.value = (recipe.value as FullRecipe)?.cuisine_id || null
  goalId.value = (recipe.value as FullRecipe)?.goal_id || null
  dietId.value = (recipe.value as FullRecipe)?.diet_id || null
  allergyId.value = (recipe.value as FullRecipe)?.allergy_id || null

  recipeIngredients.value = (recipe.value?.ingredients || []).map(
    (ing: RecipeIngredients) => ({
      ingredientId: ing.ingredient_id,
      ingredientName: ing.name,
      quantity: ing.quantity.toString(),
      unit: ing.unit
    })
  )

  recipeInstructions.value = (recipe.value?.instructions || []).map(
    (instr: RecipeInstructions) => ({
      description: instr.description,
      instruction_id: instr.instruction_id,
      step_number: instr.step_number
    })
  )
}

async function submitEdit () {
  if (!isFormValid.value) {
    editError.value = 'Veuillez remplir tous les champs obligatoires.'
    return
  }

  const ingredientError = validateIngredients()
  if (ingredientError) {
    editError.value = ingredientError
    return
  }

  await handleEdit(
    Number(route.params.id),
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
    (recipe.value?.ingredients || []).map((ing: RecipeIngredients) => ({
      ingredientId: ing.ingredient_id,
      ingredientName: ing.name,
      quantity: ing.quantity.toString(),
      unit: ing.unit
    })),
    (recipe.value?.instructions || []).map((instr: RecipeInstructions) => ({
      description: instr.description,
      instruction_id: instr.instruction_id,
      step_number: instr.step_number
    }))
  )
}

function handleEditError (msg: string) {
  editError.value = msg
}

function handleEditSuccess (msg: string) {
  editSuccess.value = msg
}

function handleEditInstructionsError (msg: string) {
  editError.value = msg
}

async function deleteRecipe () {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) return

  try {
    isDeleting.value = true
    await $fetch(`${config.public.apiUrl}/recipes/${route.params.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    navigateTo('/dashboard')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erreur lors de la suppression:', error)
    alert('Erreur lors de la suppression de la recette')
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <section v-if="recipe" class="recipe-detail">
    <!-- MODAL ÉDITION -->
    <div
      v-if="isEditing && isOwner"
      class="recipe-detail__modal-overlay"
      @click="isEditing = false"
    >
      <div class="recipe-detail__modal" @click.stop>
        <button class="recipe-detail__modal-close" @click="isEditing = false">
          ✕
        </button>

        <h2 class="recipe-detail__modal-title">Modifier la recette</h2>

        <form class="recipe-detail__edit-form" @submit.prevent="submitEdit">
          <div class="recipe-detail__form-group">
            <label class="recipe-detail__form-label">Titre *</label>
            <input
              v-model="title"
              type="text"
              class="recipe-detail__form-input"
              required
            >
          </div>

          <div class="recipe-detail__form-group">
            <label class="recipe-detail__form-label">Description *</label>
            <textarea
              v-model="description"
              class="recipe-detail__form-textarea"
              required
            />
          </div>

          <div class="recipe-detail__form-group">
            <label class="recipe-detail__form-label">Image URL</label>
            <input
              v-model="imageUrl"
              type="text"
              class="recipe-detail__form-input"
            >
          </div>

          <div class="recipe-detail__form-group">
            <label class="recipe-detail__form-label">Cuisine *</label>
            <select
              v-model="cuisineId"
              class="recipe-detail__form-select"
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

          <div class="recipe-detail__form-group">
            <label class="recipe-detail__form-label">Objectif *</label>
            <select
              v-model="goalId"
              class="recipe-detail__form-select"
              required
            >
              <option disabled value="">Sélectionner un objectif</option>
              <option v-for="g in goals" :key="g.goal_id" :value="g.goal_id">
                {{ g.name }}
              </option>
            </select>
          </div>

          <div class="recipe-detail__form-group">
            <label class="recipe-detail__form-label">Régime</label>
            <select v-model="dietId" class="recipe-detail__form-select">
              <option value="">Aucun</option>
              <option v-for="d in diets" :key="d.diet_id" :value="d.diet_id">
                {{ d.name }}
              </option>
            </select>
          </div>

          <div class="recipe-detail__form-group">
            <label class="recipe-detail__form-label">Allergie</label>
            <select v-model="allergyId" class="recipe-detail__form-select">
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
            @error="handleEditError"
            @success="handleEditSuccess"
          />

          <MyRecipesInstructionsPanel
            v-model="recipeInstructions"
            @error="handleEditInstructionsError"
          />

          <div class="recipe-detail__form-actions">
            <button
              type="submit"
              class="recipe-detail__form-btn recipe-detail__form-btn--submit"
              :disabled="editLoading"
            >
              {{
                editLoading
                  ? "Modification..."
                  : "Enregistrer les modifications"
              }}
            </button>
            <button
              type="button"
              class="recipe-detail__form-btn recipe-detail__form-btn--cancel"
              @click="isEditing = false"
            >
              Annuler
            </button>
          </div>

          <p v-if="editSuccess" class="recipe-detail__form-success">
            {{ editSuccess }}
          </p>
          <p v-if="editError" class="recipe-detail__form-error">
            {{ editError }}
          </p>
        </form>
      </div>
    </div>

    <div class="recipe-detail__container">
      <!-- IMAGE -->
      <div class="recipe-detail__image-wrapper">
        <NuxtImg
          :src="`/recipes/${recipe.image_url}`"
          :alt="recipe.title"
          class="recipe-detail__image"
        />
      </div>

      <!-- CONTENU -->
      <div class="recipe-detail__content">
        <div class="recipe-detail__header">
          <div class="recipe-detail__title-row">
            <MyTitle :level="1" size="xl" weight="bold">
              {{ recipe.title }}
            </MyTitle>
            <!-- Boutons si propriétaire -->
            <div v-if="isOwner" class="recipe-detail__actions">
              <MyButton
                size="small"
                @click="
                  () => {
                    initEditForm();
                    isEditing = true;
                  }
                "
              >
                Modifier
              </MyButton>
              <MyButton
                :disabled="isDeleting"
                variant="delete"
                size="small"
                @click="deleteRecipe"
              >
                {{ isDeleting ? "Suppression..." : "Supprimer" }}
              </MyButton>
            </div>
          </div>

          <span class="recipe-detail__cuisine-badge">
            {{ recipe.cuisine_name }}
          </span>
        </div>

        <!-- DESCRIPTION -->
        <p v-if="recipe.description" class="recipe-detail__description">
          {{ recipe.description }}
        </p>

        <!-- INFOS -->
        <div class="recipe-detail__info-grid">
          <div v-if="recipe.goal_name" class="recipe-detail__info-item">
            <span class="recipe-detail__info-label">Objectif</span>
            <span
              class="recipe-detail__info-value recipe-detail__info-value--goal"
            >
              {{ recipe.goal_name }}
            </span>
          </div>

          <div v-if="recipe.diet_name" class="recipe-detail__info-item">
            <span class="recipe-detail__info-label">Régime</span>
            <span
              class="recipe-detail__info-value recipe-detail__info-value--diet"
            >
              {{ recipe.diet_name }}
            </span>
          </div>
        </div>

        <!-- ALLERGÈNES -->
        <div
          v-if="recipe.allergy_name && (Array.isArray(recipe.allergy_name) ? recipe.allergy_name.length > 0 : (recipe.allergy_name as string).trim())"
          class="recipe-detail__allergies"
        >
          <span class="recipe-detail__allergies-title">Allergènes:</span>
          <div class="recipe-detail__allergies-list">
            <span
              v-for="(allergy, index) in Array.isArray(recipe.allergy_name) ? recipe.allergy_name : (recipe.allergy_name as string).split(',')"
              :key="index"
              class="recipe-detail__allergy-badge"
            >
              {{ typeof allergy === "string" ? allergy.trim() : allergy }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- INGRÉDIENTS ET INSTRUCTIONS -->
    <div class="recipe-detail__details">
      <!-- INGRÉDIENTS -->
      <div
        v-if="recipe.ingredients && recipe.ingredients.length > 0"
        class="recipe-detail__section"
      >
        <MyTitle
          :level="2"
          size="lg"
          weight="bold"
          class="recipe-detail__section-title"
        >
          Ingrédients
        </MyTitle>

        <ul class="recipe-detail__ingredients-list">
          <li
            v-for="ingredient in recipe.ingredients"
            :key="ingredient.ingredient_id"
            class="recipe-detail__ingredient-item"
          >
            <span class="recipe-detail__ingredient-quantity">
              {{ ingredient.quantity }} {{ ingredient.unit }}
            </span>
            <span class="recipe-detail__ingredient-name">
              {{ ingredient.name }}
            </span>
          </li>
        </ul>
      </div>

      <!-- INSTRUCTIONS -->
      <div
        v-if="recipe.instructions && recipe.instructions.length > 0"
        class="recipe-detail__section"
      >
        <MyTitle
          :level="2"
          size="lg"
          weight="bold"
          class="recipe-detail__section-title"
        >
          Préparation
        </MyTitle>

        <ol class="recipe-detail__instructions-list">
          <li
            v-for="step in recipe.instructions"
            :key="step.step_number"
            class="recipe-detail__instruction-item"
          >
            <span class="recipe-detail__instruction-number">{{
              step.step_number
            }}</span>
            <span class="recipe-detail__instruction-text">{{
              step.description
            }}</span>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.recipe-detail {
  padding: 2rem 1rem;
  min-height: 100vh;

  &__modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  &__modal {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    max-width: 700px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  &__modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    transition: color 0.2s ease;

    &:hover {
      color: #000;
    }
  }

  &__modal-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: #222;
  }

  &__edit-form {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  &__form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__form-label {
    font-weight: 600;
    font-size: 0.9rem;
    color: #333;
  }

  &__form-input,
  &__form-textarea,
  &__form-select {
    padding: 0.7rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 0.95rem;
    font-family: inherit;
    background: white;

    &:focus {
      outline: none;
      border-color: #0070f3;
      box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.1);
    }
  }

  &__form-textarea {
    resize: vertical;
    min-height: 100px;
  }

  &__form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  &__form-btn {
    flex: 1;
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &--submit {
      background: #10b981;
      color: white;

      &:hover:not(:disabled) {
        background-color: #059669;
      }

      &:disabled {
        background-color: #d1d5db;
        cursor: not-allowed;
      }
    }

    &--cancel {
      background: #e5e7eb;
      color: #333;

      &:hover {
        background-color: #d1d5db;
      }
    }
  }

  &__form-success {
    color: #059669;
    font-weight: 600;
    text-align: center;
    margin-top: 1rem;
  }

  &__form-error {
    color: #dc2626;
    font-weight: 600;
    text-align: center;
    margin-top: 1rem;
  }

  &__container {
    display: flex;
    gap: 3rem;
    max-width: 1200px;
    margin: 0 auto 3rem;

    @include medium-down {
      flex-direction: column;
      gap: 2rem;
    }
  }

  &__image-wrapper {
    flex: 0 0 400px;
    height: 400px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

    @include medium-down {
      flex: 1;
      height: 300px;
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__title-row {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    justify-content: space-between;

    @include medium-down {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__actions {
    display: flex;
    gap: 0.8rem;
    flex-wrap: wrap;
  }

  &__cuisine-badge {
    display: inline-block;
    padding: 0.6rem 1.2rem;
    background: #0070f3;
    color: #fff;
    font-size: 0.9rem;
    font-weight: 600;
    border-radius: 8px;
    text-transform: capitalize;
    width: fit-content;
  }

  &__description {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #555;
    margin: 0;
  }

  &__info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;

    @include medium-down {
      grid-template-columns: 1fr;
    }
  }

  &__info-item {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    padding: 1.2rem;
    background: #f9f9f9;
    border-radius: 8px;
    border-left: 4px solid #0070f3;
  }

  &__info-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__info-value {
    font-size: 1rem;
    font-weight: 600;
    color: #222;
    text-transform: capitalize;

    &--goal {
      color: #10b981;
    }

    &--diet {
      color: #f59e0b;
    }
  }

  &__allergies {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    background: #fef2f2;
    border-radius: 8px;
    border-left: 4px solid #dc2626;
  }

  &__allergies-title {
    font-size: 0.9rem;
    font-weight: 700;
    color: #991b1b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__allergies-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  &__allergy-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: #fee2e2;
    color: #991b1b;
    font-size: 0.85rem;
    font-weight: 600;
    border-radius: 6px;
    text-transform: uppercase;
  }

  &__details {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;

    @include medium-down {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__section-title {
    margin-bottom: 0.5rem;
  }

  &__ingredients-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  &__ingredient-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #f9f9f9;
    border-left: 4px solid #10b981;
    border-radius: 8px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f0f9f7;
    }
  }

  &__ingredient-quantity {
    flex: 0 0 auto;
    padding: 0.4rem 0.8rem;
    background: #10b981;
    color: #fff;
    font-size: 0.85rem;
    font-weight: 600;
    border-radius: 4px;
    text-align: center;
    min-width: 80px;
  }

  &__ingredient-name {
    font-size: 1rem;
    color: #222;
    font-weight: 500;
  }

  &__instructions-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  &__instruction-item {
    display: flex;
    gap: 1.5rem;
    padding: 1.5rem;
    background: #f9f9f9;
    border-left: 4px solid #f59e0b;
    border-radius: 8px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #fffbf0;
    }
  }

  &__instruction-number {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: #f59e0b;
    color: #fff;
    font-size: 1.1rem;
    font-weight: 700;
    border-radius: 50%;
  }

  &__instruction-text {
    flex: 1;
    font-size: 1rem;
    color: #333;
    line-height: 1.6;
  }
}
</style>
