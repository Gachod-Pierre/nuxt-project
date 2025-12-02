<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const postLogin = () => {
  // eslint-disable-next-line no-console
  console.log('Logging in with', email.value, password.value)
}

</script>

<template>
  <form @submit.prevent="postLogin">
    <MyInput v-model="email" label="Username" type="email"/>
    <MyInput v-model="password" label="Password" type="password"/>
    <MyButton type="submit">Se connecter</MyButton>
  </form>
</template>