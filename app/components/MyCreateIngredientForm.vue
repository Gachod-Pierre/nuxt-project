<script setup lang="ts">
import { ref } from 'vue'
import type { FetchError } from 'ofetch'

const emit = defineEmits<{
  'ingredient-created': [ingredient: Ingredient];
  error: [message: string];
}>()

const config = useRuntimeConfig()
const token = useCookie('my_token')

const newIngredientName = ref('')
const newIngredientUnit = ref('piece')

async function handleCreate () {
  if (!newIngredientName.value.trim()) {
    emit('error', 'Veuillez entrer un nom d\'ingrédient')
    return
  }

  try {
    const response = await $fetch<ApiResponse<Ingredient>>(
      `${config.public.apiUrl}/ingredients`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: {
          name: newIngredientName.value.trim(),
          unit: newIngredientUnit.value
        }
      }
    )

    if (response.data) {
      emit('ingredient-created', response.data)
      newIngredientName.value = ''
      newIngredientUnit.value = 'piece'
    }
  } catch (error: unknown) {
    const err = error as FetchError<{ message?: string }>
    emit(
      'error',
      err.data?.message || 'Erreur lors de la création de l\'ingrédient'
    )
  }
}
</script>

<template>
  <div class="create-form">
    <input
      v-model="newIngredientName"
      type="text"
      placeholder="Nom de l'ingrédient"
      class="create-form__input"
    >
    <select v-model="newIngredientUnit" class="create-form__select">
      <option value="piece">pièce(s)</option>
      <option value="gram">gramme(s)</option>
      <option value="kilogramme">kilogramme(s)</option>
      <option value="ml">mililitre(s)</option>
      <option value="liter">litre(s)</option>
      <option value="teaspoon">c.(s) à café</option>
      <option value="tablespoon">c.(s) à soupe</option>
      <option value="feuille">feuille(s)</option>
      <option value="branche">branche(s)</option>
    </select>
    <button
      type="button"
      class="create-form__btn create-form__btn--confirm"
      @click="handleCreate"
    >
      Créer
    </button>
  </div>
</template>

<style scoped lang="scss">
.create-form {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  padding: 1rem;
  background: white;
  border: 1px dashed #ccc;
  border-radius: 6px;

  &__input,
  &__select {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 0.9rem;
  }

  &__input {
    flex: 1;
    min-width: 150px;
  }

  &__select {
    flex: 1;
    min-width: 120px;
  }

  &__btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: background-color 0.2s ease;
    white-space: nowrap;

    &--confirm {
      background: #2b8a3e;
      color: white;

      &:hover {
        background-color: #1f6430;
      }
    }
  }
}
</style>
