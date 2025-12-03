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

<template>
  <div class="p-dashboard">
    <h1>Dashboard</h1>
    <my-button @click="onLogoutClick">Se déconnecter</my-button>
  </div>
</template>

<style scoped lang="scss">
div {
  min-height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
}

</style>