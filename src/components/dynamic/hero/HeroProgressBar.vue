<script setup lang="ts">
import { inject } from "vue";
import { HERO_CAROUSEL_KEY } from "@/keys/heroCarouselKeys";

// Получаем прогресс из родительского контекста
const carousel = inject(HERO_CAROUSEL_KEY);
const autoplayProgress = carousel?.autoplayProgress;
</script>

<template>
  <div class="hero-progress">
    <div
      class="hero-progress__fill"
      :style="{ width: `${(autoplayProgress || 0) * 100}%` }"
    />
  </div>
</template>
