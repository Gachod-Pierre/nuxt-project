<script setup lang="ts">
definePageMeta({
  middleware: 'guest'
})
</script>

<template>
  <div class="login">
    <div class="login__container">

      <div class="login__image">
        <img
          src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&h=800&fit=crop"
          alt="Kitchen illustration"
          class="login__image-asset"
        >
      </div>

      <div class="login__form-wrapper">
        <div class="login__form-content">
          <div class="login__header">
            <h1 class="login__title">Connexion</h1>
            <p class="login__subtitle">Accédez à votre compte</p>
          </div>

          <MyLoginForm />

          <div class="login__footer">
            <p class="login__footer-text">
              Pas encore inscrit ?
              <NuxtLink to="/signup" class="login__link">
                Créer un compte
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
  padding: 1rem;

  @media (min-width: 768px) {
      padding-top: 4rem;
      padding-bottom: 4rem;
    }
  

  &__container {
    width: 100%;
    max-width: 1200px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }

  &__image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    height: 100%;
    overflow: hidden;

    @media (max-width: 768px) {
      height: 120px;
    }
  }

  &__image-asset {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__form-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem;

    @media (max-width: 768px) {
      padding: 2rem 1.5rem;
    }

    @media (max-width: 480px) {
      padding: 1.5rem 1rem;
    }
  }

  &__form-content {
    width: 100%;
    max-width: 400px;
  }

  &__header {
    text-align: center;
    margin-bottom: 2.5rem;

    @media (max-width: 768px) {
      margin-bottom: 2rem;
    }
  }

  &__title {
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0;
    margin-bottom: 0.5rem;

    @media (max-width: 768px) {
      font-size: 1.75rem;
    }

    @media (max-width: 480px) {
      font-size: 1.5rem;
    }
  }

  &__subtitle {
    font-size: 0.95rem;
    color: #666;
    margin: 0;
    font-weight: 400;

    @media (max-width: 480px) {
      font-size: 0.9rem;
    }
  }

  &__footer {
    text-align: center;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #eee;

    @media (max-width: 768px) {
      margin-top: 1.5rem;
      padding-top: 1rem;
    }
  }

  &__footer-text {
    font-size: 0.9rem;
    color: #666;
    margin: 0;

    @media (max-width: 480px) {
      font-size: 0.85rem;
    }
  }

  &__link {
    color: #00d4ff;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;

    &:hover {
      color: #0099cc;
      text-decoration: underline;
    }
  }
}
</style>
