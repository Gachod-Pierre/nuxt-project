<!-- eslint-disable no-console -->
<script setup lang="ts">
const email = ref('')
const password = ref('')
const config = useRuntimeConfig()
const postLogin = async () => {
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
    const token = json.data.token
    const cookie = useCookie('my_token')
    cookie.value = token
    console.log(token)
    if (token) {
      await navigateTo('/dashboard')
    }
  } catch (error) {
    console.error('Login failed:', error)
  }
}

</script>

<template>
  <form class="form" @submit.prevent="postLogin">
    <MyInput v-model="password" label="Password" type="password" />
    <MyInput v-model="email" label="Email" type="email" />
    <MyButton>Se connecter</MyButton>
  </form>
</template>

<style lang="scss">
.form {
  border: 1px solid var(--color-text);
  border-radius: rem(4);
  display: flex;
  flex-direction: column;
  gap: rem(16);
  width: rem(300);
  padding: rem(16);
}
</style>