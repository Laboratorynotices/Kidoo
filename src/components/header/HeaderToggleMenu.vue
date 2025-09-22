<script setup lang="ts">
// Определяем интерфейс для props компонента
interface Props {
  modelValue: boolean;
}

// Определяем интерфейс для emit-событий
interface Emits {
  (e: "update:modelValue", value: boolean): void;
}

// Получаем props от родительского компонента
const props = defineProps<Props>();
// Определяем события, которые компонент может emit'ить
const emit = defineEmits<Emits>();

// Обработчик клика по кнопке
// Инвертирует текущее значение и отправляет родителю
const handleClick = () => {
  // emit - функция для отправки события родительскому компоненту
  // "update:modelValue" - стандартное имя события для v-model
  // !props.modelValue - инвертированное текущее значение
  emit("update:modelValue", !props.modelValue);
};
</script>

<template>
  <button
    @click="handleClick"
    class="header__toggle navbar-toggle"
    :class="{ active: modelValue }"
    :aria-label="
      modelValue ? $t('aria.nav.closeMenu') : $t('aria.nav.openMenu')
    "
    aria-controls="navbar-menu"
    :aria-expanded="modelValue"
  >
    <span class="header__toggle-bar bar"></span>
    <span class="header__toggle-bar bar"></span>
    <span class="header__toggle-bar bar"></span>
  </button>
</template>
