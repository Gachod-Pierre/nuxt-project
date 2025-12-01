<script setup lang="ts">
defineProps<{
    label?: string
    type: 'text' | 'password' | 'email'
}>()

const model = defineModel()
</script>

<template>
    <div class="inputGroup">
        <label v-if="label">{{ label }}</label>
        <input :type="type" v-model="model"/>
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