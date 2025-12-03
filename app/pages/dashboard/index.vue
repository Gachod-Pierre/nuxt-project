<template>
  <div class="p-dashboard">
    <h1>Dashboard</h1>

    <MyButton @click="onLogoutClick">Se déconnecter</MyButton>

    <MyRecipesForm />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

function onLogoutClick () {
  const token = useCookie('my_token')
  token.value = null
  return navigateTo('/login')
}
</script>
