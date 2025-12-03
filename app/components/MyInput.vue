<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    placeholder?: string
    disabled?: boolean
    variant?: 'full' | 'outline'
    color?: 'default' | 'success' | 'error' | 'warning' | 'info'
    size?: 'medium' | 'large'
    label?: string
    helperText?: string
    type?: HTMLInputElement['type']
  }>(),
  {
    placeholder: '',
    disabled: false,
    color: 'default',
    variant: 'full',
    size: 'medium',
    label: '',
    helperText: '',
    type: 'text'
  }
)

const model = defineModel({ type: String, default: '' })
</script>

<template>
  <div :class="['ui-input', `ui-input--${props.color}`, `ui-input--${props.size}`, `ui-input--${props.variant}`]">

    <label v-if="props.label" class="ui-input__label">
      {{ props.label }}
    </label>

    <input
      v-model="model"
      class="ui-input__field"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :type="props.type"
    >

    <span v-if="props.helperText" class="ui-input__helper">
      {{ props.helperText }}
    </span>

  </div>
</template>

<style lang="scss">
.ui-input {
  /* Local color variables */
  --input-bg-color: #f9f9f9;
  --input-text-color: #333;
  --input-border-color: #d1d1d1;
  --input-helper-text-color: #777;

  /* Sizes */
  --input-padding-x: 12px;
  --input-padding-y: 8px;
  --input-border-radius: 8px;
  --input-font-size: 14px;

  display: flex;
  flex-direction: column;

  /* LABEL */
  &__label {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 8px;
  }

  /* INPUT FIELD */
  &__field {
    background-color: var(--input-bg-color);
    color: var(--input-text-color);
    border: 1px solid var(--input-border-color);
    padding: var(--input-padding-y) var(--input-padding-x);
    border-radius: var(--input-border-radius);
    font-size: var(--input-font-size);
    transition: 0.2s ease;

    &::placeholder {
      color: #bbb;
    }

    &:hover:not(:disabled) {
      --input-border-color: #999;
      --input-bg-color: #f0f0f0;
    }

    &:focus {
      outline: none;
      --input-border-color: #3d4fff;
      --input-bg-color: #eef0ff;
      box-shadow: 0 0 0 3px rgba(61, 79, 255, 0.2);
    }

    &:disabled {
      --input-bg-color: #f5f5f5;
      --input-border-color: #ccc;
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  /* HELPER TEXT */
  &__helper {
    margin-top: 4px;
    font-size: 13px;
    color: var(--input-helper-text-color);
  }

  /* OUTLINE VARIANT */
  &--outline {
    --input-bg-color: transparent;

    .ui-input__field {
      border-width: 2px;

      &:hover {
        --input-bg-color: transparent;
      }

      &:focus {
        --input-bg-color: transparent;
      }

      &:disabled {
        --input-bg-color: transparent;
      }
    }
  }

  /* COLORS */
  &--success {
    --input-bg-color: #e9f8ed;
    --input-border-color: #3bbd5c;
    --input-helper-text-color: #3bbd5c;
  }

  &--info {
    --input-bg-color: #e7f1ff;
    --input-border-color: #3a78ff;
    --input-helper-text-color: #3a78ff;
  }

  &--warning {
    --input-bg-color: #fff4d6;
    --input-border-color: #e6a700;
    --input-helper-text-color: #e6a700;
  }

  &--error {
    --input-bg-color: #ffe5e5;
    --input-border-color: #e64545;
    --input-helper-text-color: #e64545;
  }

  /* SIZE LARGE */
  &--large {
    --input-padding-x: 16px;
    --input-padding-y: 12px;
    --input-font-size: 16px;

    .ui-input__label {
      font-size: 18px;
    }
  }
}
</style>
