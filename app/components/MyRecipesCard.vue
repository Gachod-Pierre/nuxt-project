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

      <div class="my-recipes-card__meta">
        <span
          v-if="recipe.goal_name"
          class="my-recipes-card__meta-item my-recipes-card__meta-item--goal"
        >
          {{ recipe.goal_name }}
        </span>
        <span
          v-if="recipe.diet_name"
          class="my-recipes-card__meta-item my-recipes-card__meta-item--diet"
        >
          {{ recipe.diet_name }}
        </span>
      </div>

      <div
        v-if="
          recipe.allergy_name &&
            (Array.isArray(recipe.allergy_name)
              ? recipe.allergy_name.length > 0
              : (recipe.allergy_name as string).trim())
        "
        class="my-recipes-card__allergies"
      >
        <span class="my-recipes-card__allergies-label">Allergènes:</span>
        <div class="my-recipes-card__allergies-list">
          <span
            v-for="(allergy, index) in Array.isArray(recipe.allergy_name)
              ? recipe.allergy_name
              : (recipe.allergy_name as string).split(',')"
            :key="index"
            class="my-recipes-card__allergy-tag"
          >
            {{ typeof allergy === "string" ? allergy.trim() : allergy }}
          </span>
        </div>
      </div>
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
    gap: 1rem;
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

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  &__meta-item {
    display: inline-block;
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
    font-weight: 500;
    border-radius: 4px;
    color: #fff;
    text-transform: capitalize;

    &--goal {
      background: #10b981;
    }

    &--diet {
      background: #f59e0b;
    }
  }

  &__allergies {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    padding-top: 0.8rem;
    border-top: 1px solid #e5e7eb;
  }

  &__allergies-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.2rem;
  }

  &__allergies-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  &__allergy-tag {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
    background: #fee2e2;
    color: #991b1b;
    border-radius: 4px;
    font-weight: 600;
    text-transform: uppercase;
    text-align: center;
    white-space: nowrap;
  }
}
</style>
