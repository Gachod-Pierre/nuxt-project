<script setup lang="ts">
definePageMeta({
  middleware: 'guest'
})
</script>

<template>
  <div class="signin">
    <div class="signin__container">

      <div class="signin__image">
        <img
          src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&h=800&fit=crop"
          alt="Cooking preparation"
          class="signin__image-asset"
        >
      </div>

      <div class="signin__form-wrapper">
        <div class="signin__form-content">
          <div class="signin__header">
            <h1 class="signin__title">Inscription</h1>
            <p class="signin__subtitle">Créez votre compte</p>
          </div>

          <MySignInForm />

          <div class="signin__footer">
            <p class="signin__footer-text">
              Déjà inscrit ?
              <NuxtLink to="/login" class="signin__link">
                Se connecter
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.signin {
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
  }

  &__form-content {
    width: 100%;
  }

  &__header {
    margin-bottom: 2rem;
    text-align: center;
  }

  &__title {
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 0.5rem 0;
  }

  &__subtitle {
    font-size: 1rem;
    color: #666;
    margin: 0;
  }

  &__footer {
    margin-top: 2rem;
    text-align: center;
  }

  &__footer-text {
    font-size: 0.95rem;
    color: #666;
    margin: 0;
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