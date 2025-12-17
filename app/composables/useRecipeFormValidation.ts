import { ref, computed } from 'vue'

export function useRecipeFormValidation () {
  const title = ref('')
  const description = ref('')
  const imageUrl = ref('')
  const cuisineId = ref<number | null>(null)
  const goalId = ref<number | null>(null)
  const dietId = ref<number | null>(null)
  const allergyId = ref<number | null>(null)

  const recipeIngredients = ref<RecipeIngredient[]>([])
  const recipeInstructions = ref<RecipeInstruction[]>([])

  const fieldErrors = computed(() => ({
    title: !title.value,
    description: !description.value,
    cuisine: !cuisineId.value,
    goal: !goalId.value
  }))

  const isFormValid = computed(() => {
    return (
      !fieldErrors.value.title &&
      !fieldErrors.value.description &&
      !fieldErrors.value.cuisine &&
      !fieldErrors.value.goal
    )
  })

  function validateIngredients (): string | null {
    for (const ingredient of recipeIngredients.value) {
      if (ingredient.ingredientId && !ingredient.quantity) {
        return `Veuillez remplir la quantité pour l'ingrédient "${ingredient.ingredientName}"`
      }
    }
    return null
  }

  function resetForm () {
    title.value = ''
    description.value = ''
    imageUrl.value = ''
    cuisineId.value = null
    goalId.value = null
    dietId.value = null
    allergyId.value = null
    recipeIngredients.value = []
    recipeInstructions.value = []
  }

  return {
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
  }
}
