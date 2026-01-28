<script setup lang="ts">
import { useSlots, computed } from "vue";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const props = withDefaults(
  defineProps<{
    id?: string;
    level?: HeadingLevel;
    skeletonLineWidth?: string;
  }>(),
  {
    level: "h2",
  },
);

/*
  Ширина линии скелетона в символах (ch).

  Если значение передано через props — используем его.
  Иначе генерируем случайную ширину от 20 до 40ch.

  Tailwind-класс не используется, потому что:
  - значение динамическое
  - класс невозможно сгенерировать заранее

  Проценты не применяются, так как родительский элемент
  не имеет фиксированной ширины.
*/
const skeletonLineWidth = computed(() => {
  return props.skeletonLineWidth
    ? Number(props.skeletonLineWidth)
    : Math.floor(Math.random() * 20) + 20;
});

const slots = useSlots();

/*
  Проверяем, есть ли реальный контент в default-слоте.
  Если слот пуст — показываем скелетон.
*/
const hasContent = computed(() => {
  const slot = slots.default?.();
  return slot && slot.some((vnode) => vnode.children);
});
</script>

<template>
  <component :is="level" :id="id">
    <slot v-if="hasContent" />

    <span
      v-else
      aria-hidden="true"
      class="skeleton-line"
      :style="`--skeletonLineWidth: ${skeletonLineWidth}`"
    />
  </component>
</template>
