<script setup lang="ts">
const props = defineProps<{
  cuisines: Cuisine[];
  modelValue: Cuisine['name'][];
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Cuisine['name'][]];
}>()

function handleFilterClick (cuisineName: Cuisine['name']) {
  const isSelected = props.modelValue.includes(cuisineName)
  const newFilters = isSelected
    ? props.modelValue.filter((f: string) => f !== cuisineName)
    : [...props.modelValue, cuisineName]

  emit('update:modelValue', newFilters)
}
</script>

<template>
  <div class="my-filters-panel">
    <div class="my-filters-panel__buttons">
      <MyButton
        v-for="cuisine in cuisines"
        :key="cuisine.cuisine_id"
        :variant="modelValue.includes(cuisine.name) ? 'default' : 'outline'"
        @click="handleFilterClick(cuisine.name)"
      >
        {{ cuisine.name }}
      </MyButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.my-filters-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #222;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__buttons {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.8rem;
  }
}
</style>
