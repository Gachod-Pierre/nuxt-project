import { ref } from 'vue'
import type { FetchError } from 'ofetch'

export function useRecipeFormEdit () {
  const loading = ref(false)
  const successMessage = ref('')
  const errorMessage = ref('')

  async function handleEdit (
    recipeId: number,
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
    originalIngredients: RecipeIngredient[],
    originalInstructions: RecipeInstruction[]
  ) {
    loading.value = true
    successMessage.value = ''
    errorMessage.value = ''

    try {
      // 1. Update recipe basic info
      await $fetch(`${config.public.apiUrl}/recipes/${recipeId}/title`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token.value}` },
        body: { title: formData.title }
      })

      // 2. Update allergy
      await $fetch(`${config.public.apiUrl}/recipes/${recipeId}/allergy`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token.value}` },
        body: { AllergiesInformation_id: formData.allergyId }
      })

      // 3. Remove old ingredients
      for (const ing of originalIngredients) {
        if (ing.ingredientId) {
          await $fetch(
            `${config.public.apiUrl}/recipes/${recipeId}/ingredients/${ing.ingredientId}`,
            {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token.value}` }
            }
          )
        }
      }

      // 4. Add new ingredients
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

      // 5. Remove old instructions
      for (const instr of originalInstructions) {
        if ((instr as RecipeInstructions).instruction_id) {
          await $fetch(
            `${config.public.apiUrl}/instructions/${
              (instr as RecipeInstructions).instruction_id
            }/recipe/${recipeId}`,
            {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token.value}` }
            }
          )
        }
      }

      // 6. Add new instructions
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

      successMessage.value = 'Recette modifiée avec succès !'
      setTimeout(() => location.reload(), 1500)
    } catch (error: unknown) {
      const err = error as FetchError<{ message?: string }>
      errorMessage.value =
        err.data?.message || 'Erreur lors de la modification'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    successMessage,
    errorMessage,
    handleEdit
  }
}
