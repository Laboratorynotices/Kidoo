<script setup lang="ts">
import { onMounted } from "vue";
import { useTheme } from "@/composables/useTheme";
import { useLayout } from "@/composables/layout";

import HeaderApp from "@/components/header/HeaderApp.vue";

// Получаем методы для работы с темами из композабла
const { currentTheme, initTheme } = useTheme();

// Получаем методы для работы с динамическим layout
const {
  visibleSections,
  resolveComponent,
  fetchConfigs,
  /*, isLoading */
} = useLayout();

/**
 * Хук жизненного цикла - выполняется после монтирования компонента
 * Инициализирует тему на основе сохраненных пользовательских предпочтений
 * и загружает конфигурацию layout для текущей темы
 */
onMounted(async () => {
  // Восстанавливаем ранее выбранную тему из localStorage
  initTheme();

  // Загружаем конфигурацию компонентов для текущей темы
  await fetchConfigs(currentTheme.value);
});
</script>

<template>
  <HeaderApp />

  <!-- TODO: Добавить skeleton loader когда isLoading === true -->

  <!-- Динамический рендеринг секций на основе конфигурации из API -->
  <component
    v-for="section in visibleSections"
    :key="section.name"
    :is="resolveComponent(section.name)"
    v-bind="section.props"
  />
</template>
