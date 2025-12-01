<script setup lang="ts">

import { computed } from 'vue'

const props = defineProps<{
  size?: 'giant' | 'large' | 'medium' | 'small' | 'tiny'
  disabled?: boolean
  href?: string
  variant?: 'default' | 'outline'
}>()

const sizeClass = computed(() => {
  return {
    giant: '-giant',
    large: '-large',
    medium: '-medium',
    small: '-small',
    tiny: '-tiny',
  }[props.size ?? 'medium']
})

const variantClass = computed(() => {
  return `-${props.variant ?? 'default'}`
})

const emit = defineEmits(['clickAndHover']);

function handleClickAndHover() {
  emit('clickAndHover');
}

</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    class="button"
    :class="[sizeClass, variantClass]"
    :disabled="disabled"
    @click="handleClickAndHover"
    @mouseenter="handleClickAndHover"
  >
    <slot />
  </component>
</template>

<style scoped lang="scss">
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  border-radius: 8px;
  transition:
    background-color 0.15s,
    transform 0.15s,
    color 0.15s,
    border-color 0.15s;

  --btn-bg: #3d4fff;
  --btn-color: #fff;
  --btn-border: transparent;

  --btn-bg-hover: #5b66ff;
  --btn-color-hover: #fff;
  --btn-border-hover: transparent;

  --btn-bg-press: #1e2bee;
  --btn-color-press: #fff;
  --btn-border-press: transparent;

  --btn-bg-disabled: #e6e6e6;
  --btn-color-disabled: #9f9f9f;
  --btn-border-disabled: transparent;

  background-color: var(--btn-bg);
  color: var(--btn-color);
  border: 1px solid var(--btn-border);

  &:hover:not([disabled]) {
    background-color: var(--btn-bg-hover);
    border-color: var(--btn-border-hover);
    color: var(--btn-color-hover);
  }

  &:active:not([disabled]) {
    background-color: var(--btn-bg-press);
    border-color: var(--btn-border-press);
    color: var(--btn-color-press);
  }

  &:focus-visible:not([disabled]) {
    outline: 3px solid rgba(50, 90, 255, 0.4);
    outline-offset: 2px;
  }

  &[disabled] {
    background-color: var(--btn-bg-disabled);
    border-color: var(--btn-border-disabled);
    color: var(--btn-color-disabled);
    cursor: not-allowed;
  }

  &.-giant {
    height: 64px;
    padding: 0 32px;
    font-size: 1.2rem;
  }
  &.-large {
    height: 56px;
    padding: 0 28px;
    font-size: 1.1rem;
  }
  &.-medium {
    height: 48px;
    padding: 0 24px;
    font-size: 1rem;
  }
  &.-small {
    height: 40px;
    padding: 0 20px;
    font-size: 0.9rem;
  }
  &.-tiny {
    height: 32px;
    padding: 0 16px;
    font-size: 0.8rem;
    border-radius: 6px;
  }

  &.-outline {
    --btn-bg: transparent;
    --btn-border: #3d4fff;
    --btn-color: #3d4fff;

    --btn-bg-hover: rgba(61, 79, 255, 0.1);
    --btn-border-hover: #3d4fff;
    --btn-color-hover: #3d4fff;

    --btn-bg-press: rgba(61, 79, 255, 0.2);
    --btn-border-press: #3d4fff;
    --btn-color-press: #3d4fff;

    --btn-bg-disabled: transparent;
    --btn-border-disabled: #E5E7EA;
    --btn-color-disabled: #b5b5b5;
  }
}
</style>
