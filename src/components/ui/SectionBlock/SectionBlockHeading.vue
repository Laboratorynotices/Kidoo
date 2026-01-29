<script setup lang="ts">
import { useSlots, computed, type ComputedRef } from "vue";

/**
 * Допустимые HTML-теги для заголовка.
 * Используются для динамического рендера через
 * <component :is="..." />
 */
type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/**
 * Пропсы компонента
 */
const props = withDefaults(
  defineProps<{
    /**
     * id HTML-элемента заголовка.
     * Используется, например, для якорей (#anchor).
     */
    id?: string;

    /**
     * Уровень заголовка (h1–h6).
     * Определяет, какой HTML-тег будет отрендерен.
     */
    level?: HeadingLevel;

    /**
     * Ширина линии скелетона.
     *
     * Принимает строку с любой валидной CSS-величиной длины,
     * включая относительные, абсолютные и viewport-единицы.
     *
     * Поддерживаемые примеры:
     * - Символьные: `ch`
     * - Шрифтовые: `em`, `rem`
     * - Абсолютные: `px`
     * - Процентные: `%`
     * - Viewport (классические): `vw`, `vh`, `vmin`, `vmax`
     * - Viewport (новые, адаптивные):
     *   `svw`, `svh` — small viewport
     *   `lvw`, `lvh` — large viewport
     *   `dvw`, `dvh` — dynamic viewport
     *
     * Если значение передано через props — используется как есть.
     * Если нет — ширина генерируется автоматически (в `ch`).
     *
     * Примеры:
     * - "24ch"
     * - "1.5em"
     * - "120px"
     * - "40%"
     * - "10svw"
     */
    skeletonLineWidth?: string;
  }>(),
  {
    /**
     * Значение по умолчанию.
     * Самый частый и безопасный вариант.
     */
    level: "h2",
  },
);

/**
 * Итоговая ширина линии скелетона.
 *
 * Если значение пришло из props — используем его напрямую.
 * Иначе генерируем случайную ширину от 10 до 20 `ch`.
 */
const skeletonLineWidth: ComputedRef<string> = computed(() => {
  return props.skeletonLineWidth ?? `${Math.floor(Math.random() * 10) + 10}ch`;
});

const slots = useSlots();

/**
 * Проверяем, есть ли реальный контент в default-слоте.
 *
 * Если слот отсутствует или не содержит дочерних узлов,
 * считаем, что контента нет и показываем скелетон.
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
