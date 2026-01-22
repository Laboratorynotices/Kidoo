<script setup lang="ts">
defineProps<{
  // ID передаём для строгой типизации атрибутов компонента
  id?: string;
}>();
</script>

<template>
  <p :id="id">
    <slot />
  </p>
</template>
