<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  ingredients: Ingredient[] | undefined;
  modelValue: RecipeIngredient[];
}>()

const emit = defineEmits<{
  'update:modelValue': [value: RecipeIngredient[]];
  error: [message: string];
  success: [message: string];
}>()

const recipeIngredients = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const showNewIngredientForm = ref(false)
const localIngredients = ref<Ingredient[]>(props.ingredients || [])

watch(
  () => props.ingredients,
  (newVal) => {
    if (newVal) {
      localIngredients.value = newVal
    }
  }
)

function addIngredient () {
  recipeIngredients.value.push({
    ingredientId: null,
    ingredientName: '',
    quantity: '',
    unit: ''
  })
}

function removeIngredient (index: number) {
  recipeIngredients.value.splice(index, 1)
}

function updateIngredientUnit (index: number) {
  const ingredient = recipeIngredients.value[index]
  if (ingredient && ingredient.ingredientId && localIngredients.value) {
    const selectedIngredient = localIngredients.value.find(
      (ing) => ing.ingredient_id === ingredient.ingredientId
    )
    if (selectedIngredient) {
      ingredient.unit = selectedIngredient.unit
      ingredient.ingredientName = selectedIngredient.name
    }
  }
}

function handleIngredientCreated (ingredient: Ingredient) {
  localIngredients.value.push(ingredient)
  recipeIngredients.value.push({
    ingredientId: ingredient.ingredient_id,
    ingredientName: ingredient.name,
    quantity: '',
    unit: ingredient.unit
  })
  showNewIngredientForm.value = false
  emit('success', 'Ingrédient créé avec succès')
}
</script>

<template>
  <div class="ingredients-panel__section">
    <div class="ingredients-panel__header">
      <label class="ingredients-panel__label">Ingrédients</label>
      <button
        type="button"
        class="ingredients-panel__btn"
        @click="addIngredient"
      >
        + Ajouter un ingrédient
      </button>
    </div>

    <div v-if="recipeIngredients.length > 0" class="ingredients-panel__list">
      <div
        v-for="(ingredient, idx) in recipeIngredients"
        :key="idx"
        class="ingredients-panel__row"
      >
        <select
          v-model="ingredient.ingredientId"
          class="ingredients-panel__select"
          @change="updateIngredientUnit(idx)"
        >
          <option value="">Sélectionner un ingrédient</option>
          <option
            v-for="ing in localIngredients"
            :key="ing.ingredient_id"
            :value="ing.ingredient_id"
          >
            {{ ing.name }}
          </option>
        </select>
        <div class="ingredients-panel__quantity">
          <input
            v-model="ingredient.quantity"
            type="number"
            placeholder="Quantité"
            class="ingredients-panel__input"
          >
          <span v-if="ingredient.unit" class="ingredients-panel__unit">{{
            ingredient.unit
          }}</span>
        </div>
        <button
          type="button"
          class="ingredients-panel__btn-remove"
          @click="removeIngredient(idx)"
        >
          ✕
        </button>
      </div>
    </div>

    <div
      v-if="!showNewIngredientForm"
      class="ingredients-panel__create-trigger"
    >
      <button
        type="button"
        class="ingredients-panel__btn ingredients-panel__btn--secondary"
        @click="showNewIngredientForm = true"
      >
        + Créer un nouvel ingrédient
      </button>
    </div>

    <MyCreateIngredientForm
      v-if="showNewIngredientForm"
      :ingredients="localIngredients"
      @ingredient-created="handleIngredientCreated"
      @error="(msg) => emit('error', msg)"
    />
  </div>
</template>

<style scoped lang="scss">
.ingredients-panel {
  &__section {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 8px;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  &__label {
    font-weight: 600;
    font-size: 0.95rem;
  }

  &__btn {
    padding: 0.5rem 1rem;
    background: #0070f3;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #0055cc;
    }

    &--secondary {
      background: #666;
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;

      &:hover {
        background-color: #555;
      }
    }
  }

  &__btn-remove {
    padding: 0.4rem 0.6rem;
    background: #d0342c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    flex-shrink: 0;

    &:hover {
      background-color: #b8241f;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  &__row {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  &__select,
  &__input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 0.9rem;
    background: white;
  }

  &__select {
    flex: 1;
  }

  &__input {
    flex: 0.5;
  }

  &__quantity {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 0.7;
  }

  &__unit {
    font-size: 0.85rem;
    color: #666;
    font-weight: 500;
    white-space: nowrap;
    background: #f0f0f0;
    padding: 0.4rem 0.6rem;
    border-radius: 4px;
  }

  &__create-trigger {
    display: flex;
  }
}
</style>
