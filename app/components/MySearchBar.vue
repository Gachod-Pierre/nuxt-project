<script setup lang="ts">
defineProps<{
  modelValue: string;
}>()

defineEmits<{
  'update:modelValue': [value: string];
}>()
</script>

<template>
  <div class="my-search-bar">
    <input
      :value="modelValue"
      type="text"
      class="my-search-bar__input"
      placeholder="Rechercher une recette..."
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    >
  </div>
</template>

<style lang="scss" scoped>
.my-search-bar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  &__input {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #0070f3;
      box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.1);
    }

    &::placeholder {
      color: #999;
    }
  }

  &__info {
    font-size: 0.9rem;
    color: #666;
    padding-left: 0.25rem;
  }
}
</style>
