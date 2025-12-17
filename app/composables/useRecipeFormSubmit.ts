import { ref } from 'vue'
import type { FetchError } from 'ofetch'

export function useRecipeFormSubmit () {
  const loading = ref(false)
  const successMessage = ref('')
  const errorMessage = ref('')

  async function handleSubmit (
    config: ReturnType<typeof useRuntimeConfig>,
    token: { value?: string | null },
    formData: {
      title: string;
      description: string;
      imageUrl: string;
      cuisineId: number | null;
      goalId: number | null;
      dietId: number | null;
      allergyId: number | null;
      ingredients: RecipeIngredient[];
      instructions: RecipeInstruction[];
    },
    resetFn: () => void
  ) {
    loading.value = true
    successMessage.value = ''
    errorMessage.value = ''

    try {
      const recipeResponse = await $fetch<ApiResponse<{ recipe_id: number }>>(
        `${config.public.apiUrl}/recipes`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.value}`
          },
          body: {
            title: formData.title,
            description: formData.description,
            image_url: formData.imageUrl,
            cuisine_id: formData.cuisineId,
            goal_id: formData.goalId,
            DietaryInformation_id: formData.dietId,
            AllergiesInformation_id: formData.allergyId
          }
        }
      )

      const recipeId = recipeResponse.data?.recipe_id
      if (!recipeId)
      {throw new Error('Impossible de récupérer l\'ID de la recette')}

      for (const ingredient of formData.ingredients) {
        if (ingredient.ingredientId && ingredient.quantity) {
          await $fetch(
            `${config.public.apiUrl}/recipes/${recipeId}/ingredients`,
            {
              method: 'POST',
              headers: { Authorization: `Bearer ${token.value}` },
              body: {
                ingredient_id: ingredient.ingredientId,
                quantity: parseFloat(ingredient.quantity)
              }
            }
          )
        }
      }

      for (let idx = 0; idx < formData.instructions.length; idx++) {
        const instr = formData.instructions[idx]
        if (instr?.description.trim()) {
          await $fetch(`${config.public.apiUrl}/instructions`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token.value}` },
            body: {
              recipe_id: recipeId,
              step_number: idx + 1,
              description: instr.description.trim()
            }
          })
        }
      }

      successMessage.value = 'Recette créée avec succès !'
      resetFn()
      setTimeout(() => location.reload(), 1500)
    } catch (error: unknown) {
      const err = error as FetchError<{ message?: string }>
      errorMessage.value = err.data?.message || 'Erreur lors de la création'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    successMessage,
    errorMessage,
    handleSubmit
  }
}
