<script setup lang="ts">


</script>

<template>
    <div class="ct-test">
        <div class="ct-buttons">
            <!-- Variante Default -->
            <section class="ct-buttons__default">
                <MyButton size="tiny">Tiny</MyButton>
                <MyButton size="small">Small</MyButton>
                <MyButton size="medium">Medium</MyButton>
                <MyButton size="large">Large</MyButton>
                <MyButton size="giant" disabled>Giant (Disabled)</MyButton>
            </section>

            <!-- Variante Outline -->
            <section class="ct-buttons__outline">
                <MyButton variant="outline" size="tiny">Tiny</MyButton>
                <MyButton variant="outline" size="small">Small</MyButton>
                <MyButton variant="outline" size="medium">Medium</MyButton>
                <MyButton variant="outline" size="large">Large</MyButton>
                <MyButton variant="outline" size="giant" disabled>Giant (Disabled)</MyButton>
            </section>
        </div>

            <div class="ct-inputs">
                <section class="ct-inputs__section">
                <h2>Variantes de couleurs</h2>
                <MyInput placeholder="Default" />
                <MyInput placeholder="Success" color="success" />
                <MyInput placeholder="Error" color="error" />
                <MyInput placeholder="Warning" color="warning" />
                <MyInput placeholder="Info" color="info" />
                </section>

                <section class="ct-inputs__section">
                <h2>Variantes Outline</h2>
                <MyInput placeholder="Default" variant="outline" />
                <MyInput placeholder="Success" color="success" variant="outline" />
                <MyInput placeholder="Error" color="error" variant="outline" />
                <MyInput placeholder="Warning" color="warning" variant="outline" />
                <MyInput placeholder="Info" color="info" variant="outline" />
                </section>

                <section class="ct-inputs__section">
                <h2>Tailles</h2>
                <MyInput placeholder="Medium" size="medium" />
                <MyInput placeholder="Large" size="large" />
                </section>

                <section class="ct-inputs__section">
                <h2>Combinaisons</h2>
                <MyInput color="success" size="large" variant="outline" label="Success Outline Large" />
                <MyInput color="error" size="medium" variant="full" label="Error Full Medium" />
                </section>
            </div>

        <div class="ct-loginForm">
            <MyLoginForm />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.ct-buttons__default,
.ct-buttons__outline {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
  align-items: center;
}

.ct-inputs {
  margin-top: 3rem;
}

.ct-inputs__section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: black;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-size: 1.25rem;
    color: #333;
  }

  :deep(.ui-input) {
    margin-bottom: 1.5rem;
  }
}
</style>