<script setup lang="ts">
// Определяем допустимые уровни заголовков
type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const props = withDefaults(
  defineProps<{
    id?: string;
    // Уровень заголовка определяет семантику (h1, h2, etc.)
    level?: HeadingLevel;
  }>(),
  {
    level: "h2",
  },
);
</script>

<template>
  <component :is="level" :id="id">
    <slot />
  </component>
</template>
