import { jwtDecode } from 'jwt-decode'

export default defineNuxtRouteMiddleware(() => {
  const token = useCookie('my_token')
  if (!token || !token.value || !token.value.length) {
    return navigateTo('/login')
  }
  const decoded = jwtDecode(token.value)
  if (!(decoded.exp && decoded.exp > (Date.now()/ 1000))) {
    return navigateTo('/login')
  }
})