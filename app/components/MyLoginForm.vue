<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FetchError } from 'ofetch'

const email = ref('')
const password = ref('')

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const config = useRuntimeConfig()

/* ============================
   VALIDATION
============================ */

const fieldErrors = computed(() => ({
  email: !email.value,
  password: !password.value
}))

const isFormValid = computed(() => {
  return !fieldErrors.value.email &&
         !fieldErrors.value.password
})

/* ============================
   LOGIN
============================ */

const postLogin = async () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Veuillez remplir tous les champs obligatoires.'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await fetch(`${config.public.apiUrl}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const json = await response.json()

    if (!response.ok) {
      throw new Error(json.message || 'Erreur de connexion')
    }

    const token = json.data.token
    const cookie = useCookie('my_token')
    cookie.value = token

    successMessage.value = 'Connexion réussie !'

    if (token) {
      await navigateTo('/dashboard')
    }

  } catch (err: unknown) {
    const error = err as FetchError<{ message?: string }>
    errorMessage.value = error.data?.message || error.message || 'Échec de connexion'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="login-form" @submit.prevent="postLogin">

    <!-- Email -->
    <div class="login-form__group">
      <MyInput
        v-model="email"
        label="Email *"
        type="email"
        placeholder="ex: jean@example.com"
        :color="fieldErrors.email ? 'error' : 'default'"
      />
    </div>

    <!-- Password -->
    <div class="login-form__group">
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
      class="login-form__button"
    >
      {{ loading ? "Connexion..." : "Se connecter" }}
    </MyButton>

    <!-- Messages -->
    <p v-if="errorMessage" class="login-form__error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="login-form__success">{{ successMessage }}</p>

  </form>
</template>

<style scoped lang="scss">
.login-form {
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
