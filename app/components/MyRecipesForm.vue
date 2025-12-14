<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FetchError } from 'ofetch'

const config = useRuntimeConfig()
const token = useCookie('my_token')

/* ========================
   FORM STATE
======================== */

const title = ref('')
const description = ref('')
const imageUrl = ref('')
const cuisineId = ref<number | null>(null)
const goalId = ref<number | null>(null)
const dietId = ref<number | null>(null)
const allergyId = ref<number | null>(null)

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

/* ========================
   API DATA
======================== */

const [
  { data: cuisines },
  { data: goals },
  { data: diets },
  { data: allergies }
] = await Promise.all([
  useAsyncData('cuisines', async () => {
    const { data } = await $fetch<ApiResponse<Cuisine[]>>(
      `${config.public.apiUrl}/cuisines`
    )
    return data
  }),

  useAsyncData('goals', async () => {
    const { data } = await $fetch<ApiResponse<Goal[]>>(
      `${config.public.apiUrl}/goals`
    )
    return data
  }),

  useAsyncData('dietaryInformation', async () => {
    const { data } = await $fetch<ApiResponse<Diet[]>>(
      `${config.public.apiUrl}/dietaryInformations`
    )
    return data
  }),

  useAsyncData('allergiesInformation', async () => {
    const { data } = await $fetch<ApiResponse<Allergy[]>>(
      `${config.public.apiUrl}/allergiesInformations`
    )
    return data
  })
])

/* ========================
   VALIDATION
======================== */

const fieldErrors = computed(() => ({
  title: !title.value,
  description: !description.value,
  cuisine: !cuisineId.value,
  goal: !goalId.value
}))

const isFormValid = computed(() => {
  return (
    !fieldErrors.value.title &&
    !fieldErrors.value.description &&
    !fieldErrors.value.cuisine &&
    !fieldErrors.value.goal
  )
})

/* ========================
   SUBMIT FORM
======================== */

async function handleSubmit () {
  if (!isFormValid.value) {
    errorMessage.value = 'Veuillez remplir tous les champs obligatoires.'
    return
  }

  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    await $fetch(`${config.public.apiUrl}/recipes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: {
        title: title.value,
        description: description.value,
        image_url: imageUrl.value,
        cuisine_id: cuisineId.value,
        goal_id: goalId.value,
        DietaryInformation_id: dietId.value,
        AllergiesInformation_id: allergyId.value
      }
    })

    successMessage.value = 'Recette créée avec succès !'
    resetForm()

    setTimeout(() => {
      location.reload()
    }, 1500)
  } catch (error: unknown) {
    const err = error as FetchError<{ message?: string }>
    errorMessage.value = err.data?.message || 'Erreur lors de la création'
  } finally {
    loading.value = false
  }
}

function resetForm () {
  title.value = ''
  description.value = ''
  imageUrl.value = ''
  cuisineId.value = null
  goalId.value = null
  dietId.value = null
  allergyId.value = null
}
</script>

<template>
  <section class="recipes-form">
    <MyTitle :level="2" size="lg" weight="bold">Créer une recette</MyTitle>

    <form class="recipes-form__form" @submit.prevent="handleSubmit">
      <!-- Titre -->
      <div class="recipes-form__group">
        <MyInput
          v-model="title"
          label="Titre *"
          placeholder="Titre de la recette"
          :color="fieldErrors.title ? 'error' : 'default'"
          required
        />
      </div>

      <!-- Description -->
      <div class="recipes-form__group">
        <MyInput
          v-model="description"
          label="Description *"
          placeholder="Décris ta recette..."
          :color="fieldErrors.description ? 'error' : 'default'"
          required
        />
      </div>

      <!-- Image -->
      <div class="recipes-form__group">
        <MyInput
          v-model="imageUrl"
          label="Image URL"
          placeholder="ex: poulet.jpg"
        />
      </div>

      <!-- Cuisine -->
      <div class="recipes-form__group">
        <label class="recipes-form__label">Cuisine *</label>
        <select
          v-model="cuisineId"
          class="recipes-form__select"
          :class="{ 'recipes-form__select--error': fieldErrors.cuisine }"
          required
        >
          <option disabled value="">Sélectionner une cuisine</option>
          <option
            v-for="c in cuisines"
            :key="c.cuisine_id"
            :value="c.cuisine_id"
          >
            {{ c.name }}
          </option>
        </select>
      </div>

      <!-- Objectif -->
      <div class="recipes-form__group">
        <label class="recipes-form__label">Objectif *</label>
        <select
          v-model="goalId"
          class="recipes-form__select"
          :class="{ 'recipes-form__select--error': fieldErrors.goal }"
          required
        >
          <option disabled value="">Sélectionner un objectif</option>
          <option v-for="g in goals" :key="g.goal_id" :value="g.goal_id">
            {{ g.name }}
          </option>
        </select>
      </div>

      <!-- Régime -->
      <div class="recipes-form__group">
        <label class="recipes-form__label">Régime</label>
        <select v-model="dietId" class="recipes-form__select">
          <option value="">Aucun</option>
          <option v-for="d in diets" :key="d.diet_id" :value="d.diet_id">
            {{ d.name }}
          </option>
        </select>
      </div>

      <!-- Allergies -->
      <div class="recipes-form__group">
        <label class="recipes-form__label">Allergie</label>
        <select v-model="allergyId" class="recipes-form__select">
          <option value="">Aucune</option>
          <option
            v-for="a in allergies"
            :key="a.allergy_id"
            :value="a.allergy_id"
          >
            {{ a.name }}
          </option>
        </select>
      </div>

      <!-- Submit -->
      <MyButton
        class="recipes-form__button"
        :disabled="loading || !isFormValid"
        size="medium"
      >
        {{ loading ? "Création..." : "Créer la recette" }}
      </MyButton>
    </form>

    <p v-if="successMessage" class="recipes-form__success">
      {{ successMessage }}
    </p>
    <p v-if="errorMessage" class="recipes-form__error">{{ errorMessage }}</p>
  </section>
</template>

<style scoped lang="scss">
.recipes-form {
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &__title {
    font-size: 1.8rem;
    font-weight: 700;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1.4rem;
  }

  &__group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  &__label {
    font-weight: 600;
    font-size: 0.95rem;
  }

  &__select {
    padding: 0.6rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 0.95rem;
    background: white;

    &--error {
      border-color: #d0342c;
      background: #ffeaea;
    }
  }

  &__button {
    margin-top: 0.8rem;
    align-self: flex-start;
  }

  &__success {
    color: #2b8a3e;
    font-weight: 600;
  }

  &__error {
    color: #c52121;
    font-weight: 600;
  }
}
</style>
