<script setup lang="ts">
import SwitchLocale from "./SwitchLocale.vue";
import SwitchPalette from "./SwitchPalette.vue";
</script>

<template>
  <div class="header__switchers navbar-switchers">
    <SwitchLocale />

    <!-- Переключатель палитры (ребёнок, семья, родитель) -->
    <SwitchPalette />
  </div>
</template>
