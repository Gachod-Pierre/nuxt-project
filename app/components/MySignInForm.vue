<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FetchError } from 'ofetch'

const username = ref('')
const email = ref('')
const password = ref('')
const firstName = ref('')
const lastName = ref('')

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const config = useRuntimeConfig()

/* ============================
   VALIDATION
============================ */

const fieldErrors = computed(() => ({
  username: !username.value,
  email: !email.value,
  password: !password.value,
  firstName: !firstName.value,
  lastName: !lastName.value
}))

const isFormValid = computed(() => {
  return !fieldErrors.value.username &&
         !fieldErrors.value.email &&
         !fieldErrors.value.password &&
         !fieldErrors.value.firstName &&
         !fieldErrors.value.lastName
})

/* ============================
   SIGN IN
============================ */

const postSignIn = async () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Veuillez remplir tous les champs obligatoires.'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await fetch(`${config.public.apiUrl}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value,
        first_name: firstName.value,
        last_name: lastName.value
      })
    })

    const json = await response.json()

    if (!response.ok) {
      throw new Error(json.message || 'Erreur d\'inscription')
    }

    successMessage.value = 'Inscription réussie ! Vous pouvez maintenant vous connecter.'

    // Reset form
    username.value = ''
    email.value = ''
    password.value = ''
    firstName.value = ''
    lastName.value = ''

    // Redirect after 2 seconds
    setTimeout(() => {
      navigateTo('/login')
    }, 1500)

  } catch (err: unknown) {
    const error = err as FetchError<{ message?: string }>
    errorMessage.value = error.data?.message || error.message || 'Échec de l\'inscription'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="signin-form" @submit.prevent="postSignIn">

    <!-- Username -->
    <div class="signin-form__group">
      <MyInput
        v-model="username"
        label="Nom d'utilisateur *"
        type="text"
        placeholder="ex: jean_doe"
        :color="fieldErrors.username ? 'error' : 'default'"
      />
    </div>

    <!-- Email -->
    <div class="signin-form__group">
      <MyInput
        v-model="email"
        label="Email *"
        type="email"
        placeholder="ex: jean@example.com"
        :color="fieldErrors.email ? 'error' : 'default'"
      />
    </div>

    <!-- First Name -->
    <div class="signin-form__group">
      <MyInput
        v-model="firstName"
        label="Prénom *"
        type="text"
        placeholder="ex: Jean"
        :color="fieldErrors.firstName ? 'error' : 'default'"
      />
    </div>

    <!-- Last Name -->
    <div class="signin-form__group">
      <MyInput
        v-model="lastName"
        label="Nom *"
        type="text"
        placeholder="ex: Doe"
        :color="fieldErrors.lastName ? 'error' : 'default'"
      />
    </div>

    <!-- Password -->
    <div class="signin-form__group">
      <MyInput
        v-model="password"
        label="Mot de passe *"
        type="password"
        placeholder="Votre mot de passe"
        :color="fieldErrors.password ? 'error' : 'default'"
      />
    </div>

    <!-- Submit -->
    <MyButton
      type="submit"
      :disabled="loading || !isFormValid"
      size="medium"
      class="signin-form__button"
    >
      {{ loading ? "Inscription..." : "S'inscrire" }}
    </MyButton>

    <!-- Messages -->
    <p v-if="errorMessage" class="signin-form__error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="signin-form__success">{{ successMessage }}</p>

  </form>
</template>

<style scoped lang="scss">
.signin-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  max-width: 400px;
  margin: auto;

  &__group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  &__button {
    margin-top: 0.8rem;
    align-self: flex-start;
  }

  &__error {
    color: #d0342c;
    font-weight: 600;
  }

  &__success {
    color: #2b8a3e;
    font-weight: 600;
  }
}
</style>