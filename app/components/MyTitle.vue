<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    size?: 'xl' | 'lg' | 'md' | 'sm';
    weight?: 'bold' | 'semibold' | 'medium' | 'regular';
    color?: 'default' | 'primary' | 'muted';
  }>(),
  {
    level: 1,
    size: 'lg',
    weight: 'bold',
    color: 'default'
  }
)

const headingTag = computed(() => `h${props.level}`)
</script>

<template>
  <component
    :is="headingTag"
    :class="[
      'ui-title',
      `ui-title--${props.size}`,
      `ui-title--${props.weight}`,
      `ui-title--${props.color}`,
    ]"
  >
    <slot />
  </component>
</template>

<style lang="scss" scoped>
.ui-title {
  margin: 0;
  line-height: 1.2;
  font-family: inherit;

  /* COLORS */
  &--default {
    color: #222;
  }

  &--primary {
    color: #3d4fff;
  }

  &--muted {
    color: #666;
  }

  /* SIZES (desktop / base) */
  &--xl {
    font-size: 2.4rem;
  }

  &--lg {
    font-size: 1.9rem;
  }

  &--md {
    font-size: 1.5rem;
  }

  &--sm {
    font-size: 1.2rem;
  }

  /* WEIGHTS */
  &--bold {
    font-weight: 700;
  }

  &--semibold {
    font-weight: 600;
  }

  &--medium {
    font-weight: 500;
  }

  &--regular {
    font-weight: 400;
  }

  /* RESPONSIVE: breakpoints via mixin medium-down */
  @include medium-down {
    &--xl {
      font-size: 1.9rem;
    }

    &--lg {
      font-size: 1.6rem;
    }

    &--md {
      font-size: 1.3rem;
    }

    &--sm {
      font-size: 1.1rem;
    }
  }
}
</style>
