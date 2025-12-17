<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: RecipeInstruction[];
}>()

const emit = defineEmits<{
  'update:modelValue': [value: RecipeInstruction[]];
}>()

const recipeInstructions = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

function addInstruction () {
  recipeInstructions.value.push({
    description: ''
  })
}

function removeInstruction (index: number) {
  recipeInstructions.value.splice(index, 1)
}
</script>

<template>
  <div class="instructions-panel__section">
    <div class="instructions-panel__section-header">
      <label class="instructions-panel__label">Instructions</label>
      <button
        type="button"
        class="instructions-panel__add-btn"
        @click="addInstruction"
      >
        + Ajouter une étape
      </button>
    </div>

    <!-- Liste des instructions -->
    <div v-if="recipeInstructions.length > 0" class="instructions-panel__list">
      <div
        v-for="(instr, idx) in recipeInstructions"
        :key="idx"
        class="instructions-panel__row"
      >
        <span class="instructions-panel__number">{{ idx + 1 }}</span>
        <textarea
          v-model="instr.description"
          placeholder="Décris cette étape..."
          class="instructions-panel__textarea"
          rows="2"
        />
        <button
          type="button"
          class="instructions-panel__remove-btn"
          @click="removeInstruction(idx)"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.instructions-panel {
  &__section {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 8px;
  }

  &__section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  &__label {
    font-weight: 600;
    font-size: 0.95rem;
  }

  &__add-btn {
    padding: 0.5rem 1rem;
    background: #0070f3;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: background-color 0.2s ease;
    white-space: nowrap;

    &:hover {
      background-color: #0055cc;
    }
  }

  &__remove-btn {
    padding: 0.4rem 0.6rem;
    background: #d0342c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s ease;
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
    align-items: flex-start;
  }

  &__number {
    font-weight: 600;
    color: #0070f3;
    min-width: 1.5rem;
    padding-top: 0.5rem;
  }

  &__textarea {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 0.9rem;
    font-family: inherit;
    flex: 1;
    resize: vertical;
  }
}
</style>
