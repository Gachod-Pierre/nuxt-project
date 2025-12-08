import { jwtDecode } from 'jwt-decode'

export default defineNuxtRouteMiddleware(() => {
  const token = useCookie('my_token')

  if (token && token.value && token.value.length) {
    try {
      const decoded = jwtDecode(token.value)
      if (decoded.exp && decoded.exp > Date.now() / 1000) {
        return navigateTo('/dashboard')
      }
    } catch {
      // Token invalide, on laisse l'utilisateur accéder à la page de login
    }
  }
})
