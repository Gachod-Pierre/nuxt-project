<script setup lang="ts">
defineProps<{
  recipe: Recipe;
}>()
</script>

<template>
  <NuxtLink :to="`/recipes/${recipe.recipe_id}`" class="my-recipes-card">
    <div class="my-recipes-card__image-wrapper">
      <NuxtImg
        :src="`/recipes/${recipe.image_url}`"
        :alt="recipe.title"
        class="my-recipes-card__image"
      />
      <span class="my-recipes-card__cuisine-badge">
        {{ recipe.cuisine_name }}
      </span>
    </div>

    <div class="my-recipes-card__content">
      <h3 class="my-recipes-card__title">
        {{ recipe.title }}
      </h3>
    </div>
  </NuxtLink>
</template>

<style lang="scss" scoped>
.my-recipes-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  &__image-wrapper {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;

    .my-recipes-card:hover & {
      transform: scale(1.05);
    }
  }

  &__cuisine-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    display: inline-block;
    padding: 0.5rem 0.8rem;
    background: rgba(0, 112, 243, 0.9);
    color: #fff;
    font-size: 0.8rem;
    font-weight: 600;
    border-radius: 6px;
    text-transform: capitalize;
  }

  &__content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 1.2rem;
    gap: 0.5rem;
  }

  &__title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: #222;
    line-height: 1.4;
    transition: color 0.2s ease;

    .my-recipes-card:hover & {
      color: #0070f3;
    }
  }
}
</style>
