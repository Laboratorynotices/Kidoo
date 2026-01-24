<script setup lang="ts">
import { useSlots, computed } from "vue";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const props = withDefaults(
  defineProps<{
    id?: string;
    level?: HeadingLevel;
  }>(),
  {
    level: "h2",
  },
);

/*
Ширина от 20 до 40ch.
Не используется Tailwind CSS класс,
поскольку этот класс генерируется динамически
и он не может заранее быть известен.
Проценты не используются,
поскольку у родительского HTML-элемента нет заданной ширины,
а следовательно ширина получится равна нулю.
*/
const randomPercent = Math.floor(Math.random() * 20) + 20;
const skeletonLineWidth: string = `width: ${randomPercent}ch`;

const slots = useSlots();

// Проверяем: есть ли реальный контент
const hasContent = computed(() => {
  const slot = slots.default?.();
  return slot && slot.some((vnode) => vnode.children);
});
</script>

<template>
  <component :is="level" :id="id">
    <!-- Контент -->
    <slot v-if="hasContent" />

    <!-- Скелетон -->
    <span
      v-else
      aria-hidden="true"
      class="skeleton-line"
      :style="skeletonLineWidth"
    />
  </component>
</template>
