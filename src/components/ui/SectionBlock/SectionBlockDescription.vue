<script setup lang="ts">
import { useSlots, computed } from "vue";

defineProps<{ id?: string }>();

const lineCount: number = Math.round(Math.random()) + 2;

const slots = useSlots();

const hasContent = computed(() => {
  const slot = slots.default?.();
  return slot && slot.some((vnode) => vnode.children);
});
</script>

<template>
  <p :id="id" v-if="hasContent">
    <slot />
  </p>
  <!-- Скелетон -->
  <div v-else aria-hidden="true" class="skeleton-lines" role="status">
    <span
      v-for="n in lineCount"
      :key="n"
      class="skeleton-line skeleton-lines__line"
    />
  </div>
</template>
