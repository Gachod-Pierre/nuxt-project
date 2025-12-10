<script setup lang="ts">
defineProps<{
  modelValue: number;
  totalPages: number;
}>()

defineEmits<{
  'update:modelValue': [value: number];
}>()
</script>

<template>
  <div class="my-pagination">
    <div class="my-pagination__info">
      Page {{ modelValue }} / {{ totalPages }}
    </div>
    <div class="my-pagination__buttons">
      <button
        v-for="n in totalPages"
        :key="n"
        :class="{
          'my-pagination__button': true,
          'my-pagination__button--active': modelValue === n,
        }"
        @click="$emit('update:modelValue', n)"
      >
        {{ n }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.my-pagination {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__info {
    font-size: 0.9rem;
    font-weight: 500;
    color: #666;
  }

  &__buttons {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  &__button {
    padding: 0.5rem 0.75rem;
    font-size: 0.95rem;
    font-weight: 500;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    background: #fff;
    color: #333;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: #0070f3;
      color: #0070f3;
    }

    &--active {
      background: #0070f3;
      border-color: #0070f3;
      color: #fff;
      font-weight: 600;
    }
  }
}
</style>
