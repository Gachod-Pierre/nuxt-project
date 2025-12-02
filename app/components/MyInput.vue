<script setup lang="ts">
defineProps<{
  label?: string
  type: 'text' | 'password' | 'email'
}>()

const model = defineModel<string>()
</script>

<template>
  <div class="inputGroup">
    <label v-if="label">{{ label }}</label>
    <input v-model="model" :type="type">
  </div>
</template>

<style lang="scss">
.inputGroup {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-family: Arial, sans-serif;
    color: #000;    
}
</style>