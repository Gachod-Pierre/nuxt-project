<script lang="ts">

</script>

<template>
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
</template>


<style lang="scss" scoped>
.ct-buttons {
  &__default,
  &__outline {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    justify-content: center;
    align-items: center;
  }
}
</style>