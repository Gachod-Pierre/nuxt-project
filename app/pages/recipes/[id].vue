<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

const { data: recipe } = await useAsyncData(
  `recipe-${route.params.id}`,
  async () => {
    const { data } = await $fetch<ApiResponse<FullRecipe>>(
      `${config.public.apiUrl}/recipes/${route.params.id}`
    )
    return data
  }
)

if (!recipe.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Recette non trouvée'
  })
}
</script>

<template>
  <section v-if="recipe" class="recipe-detail">
    <div class="recipe-detail__container">
      <!-- IMAGE -->
      <div class="recipe-detail__image-wrapper">
        <NuxtImg
          :src="`/recipes/${recipe.image_url}`"
          :alt="recipe.title"
          class="recipe-detail__image"
        />
      </div>

      <!-- CONTENU -->
      <div class="recipe-detail__content">
        <div class="recipe-detail__header">
          <MyTitle :level="1" size="xl" weight="bold">
            {{ recipe.title }}
          </MyTitle>

          <span class="recipe-detail__cuisine-badge">
            {{ recipe.cuisine_name }}
          </span>
        </div>

        <!-- DESCRIPTION -->
        <p v-if="recipe.description" class="recipe-detail__description">
          {{ recipe.description }}
        </p>

        <!-- INFOS -->
        <div class="recipe-detail__info-grid">
          <div v-if="recipe.goal_name" class="recipe-detail__info-item">
            <span class="recipe-detail__info-label">Objectif</span>
            <span
              class="recipe-detail__info-value recipe-detail__info-value--goal"
            >
              {{ recipe.goal_name }}
            </span>
          </div>

          <div v-if="recipe.diet_name" class="recipe-detail__info-item">
            <span class="recipe-detail__info-label">Régime</span>
            <span
              class="recipe-detail__info-value recipe-detail__info-value--diet"
            >
              {{ recipe.diet_name }}
            </span>
          </div>
        </div>

        <!-- ALLERGÈNES -->
        <div
          v-if="recipe.allergy_name && (Array.isArray(recipe.allergy_name) ? recipe.allergy_name.length > 0 : (recipe.allergy_name as string).trim())"
          class="recipe-detail__allergies"
        >
          <span class="recipe-detail__allergies-title">Allergènes:</span>
          <div class="recipe-detail__allergies-list">
            <span
              v-for="(allergy, index) in Array.isArray(recipe.allergy_name) ? recipe.allergy_name : (recipe.allergy_name as string).split(',')"
              :key="index"
              class="recipe-detail__allergy-badge"
            >
              {{ typeof allergy === "string" ? allergy.trim() : allergy }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- INGRÉDIENTS ET INSTRUCTIONS -->
    <div class="recipe-detail__details">
      <!-- INGRÉDIENTS -->
      <div
        v-if="recipe.ingredients && recipe.ingredients.length > 0"
        class="recipe-detail__section"
      >
        <MyTitle
          :level="2"
          size="lg"
          weight="bold"
          class="recipe-detail__section-title"
        >
          Ingrédients
        </MyTitle>

        <ul class="recipe-detail__ingredients-list">
          <li
            v-for="ingredient in recipe.ingredients"
            :key="ingredient.ingredient_id"
            class="recipe-detail__ingredient-item"
          >
            <span class="recipe-detail__ingredient-quantity">
              {{ ingredient.quantity }} {{ ingredient.unit }}
            </span>
            <span class="recipe-detail__ingredient-name">
              {{ ingredient.name }}
            </span>
          </li>
        </ul>
      </div>

      <!-- INSTRUCTIONS -->
      <div
        v-if="recipe.instructions && recipe.instructions.length > 0"
        class="recipe-detail__section"
      >
        <MyTitle
          :level="2"
          size="lg"
          weight="bold"
          class="recipe-detail__section-title"
        >
          Préparation
        </MyTitle>

        <ol class="recipe-detail__instructions-list">
          <li
            v-for="step in recipe.instructions"
            :key="step.step_number"
            class="recipe-detail__instruction-item"
          >
            <span class="recipe-detail__instruction-number">{{
              step.step_number
            }}</span>
            <span class="recipe-detail__instruction-text">{{
              step.description
            }}</span>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.recipe-detail {
  padding: 2rem 1rem;
  min-height: 100vh;

  &__container {
    display: flex;
    gap: 3rem;
    max-width: 1200px;
    margin: 0 auto 3rem;

    @include medium-down {
      flex-direction: column;
      gap: 2rem;
    }
  }

  &__image-wrapper {
    flex: 0 0 400px;
    height: 400px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

    @include medium-down {
      flex: 1;
      height: 300px;
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__cuisine-badge {
    display: inline-block;
    padding: 0.6rem 1.2rem;
    background: #0070f3;
    color: #fff;
    font-size: 0.9rem;
    font-weight: 600;
    border-radius: 8px;
    text-transform: capitalize;
    width: fit-content;
  }

  &__description {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #555;
    margin: 0;
  }

  &__info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;

    @include medium-down {
      grid-template-columns: 1fr;
    }
  }

  &__info-item {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    padding: 1.2rem;
    background: #f9f9f9;
    border-radius: 8px;
    border-left: 4px solid #0070f3;
  }

  &__info-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__info-value {
    font-size: 1rem;
    font-weight: 600;
    color: #222;
    text-transform: capitalize;

    &--goal {
      color: #10b981;
    }

    &--diet {
      color: #f59e0b;
    }
  }

  &__allergies {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    background: #fef2f2;
    border-radius: 8px;
    border-left: 4px solid #dc2626;
  }

  &__allergies-title {
    font-size: 0.9rem;
    font-weight: 700;
    color: #991b1b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__allergies-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  &__allergy-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: #fee2e2;
    color: #991b1b;
    font-size: 0.85rem;
    font-weight: 600;
    border-radius: 6px;
    text-transform: uppercase;
  }

  /* ===========================
     DÉTAILS (Ingrédients & Instructions)
  =========================== */
  &__details {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;

    @include medium-down {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__section-title {
    margin-bottom: 0.5rem;
  }

  /* ===========================
     INGRÉDIENTS
  =========================== */
  &__ingredients-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  &__ingredient-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #f9f9f9;
    border-left: 4px solid #10b981;
    border-radius: 8px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f0f9f7;
    }
  }

  &__ingredient-quantity {
    flex: 0 0 auto;
    padding: 0.4rem 0.8rem;
    background: #10b981;
    color: #fff;
    font-size: 0.85rem;
    font-weight: 600;
    border-radius: 4px;
    text-align: center;
    min-width: 80px;
  }

  &__ingredient-name {
    font-size: 1rem;
    color: #222;
    font-weight: 500;
  }

  /* ===========================
     INSTRUCTIONS
  =========================== */
  &__instructions-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  &__instruction-item {
    display: flex;
    gap: 1.5rem;
    padding: 1.5rem;
    background: #f9f9f9;
    border-left: 4px solid #f59e0b;
    border-radius: 8px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #fffbf0;
    }
  }

  &__instruction-number {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: #f59e0b;
    color: #fff;
    font-size: 1.1rem;
    font-weight: 700;
    border-radius: 50%;
  }

  &__instruction-text {
    flex: 1;
    font-size: 1rem;
    color: #333;
    line-height: 1.6;
  }
}
</style>
