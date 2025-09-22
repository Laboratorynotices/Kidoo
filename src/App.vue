<script setup lang="ts">
import { onMounted } from "vue";
import { switchLocale } from "./i18n";
import { useTheme } from "@/composables/useTheme";

import HeaderApp from "@/components/header/HeaderApp.vue";

// Получаем методы для работы с темами из композабла
const { setTheme, initTheme } = useTheme();

/**
 * Хук жизненного цикла - выполняется после монтирования компонента
 * Инициализирует тему на основе сохраненных пользовательских предпочтений
 */
onMounted(() => {
  // Восстанавливаем ранее выбранную тему из localStorage
  initTheme();
});
</script>

<template>
  <HeaderApp />
  <div>
    <p>{{ $t("hello") }}</p>
    <button @click="switchLocale">{{ $t("switch language") }}</button>
  </div>
  <div>
    <p>{{ $t("introduce yourself") }}</p>
    <button @click="setTheme('child')">{{ $t("child") }}</button>
    <button @click="setTheme('family')">{{ $t("family") }}</button>
    <button @click="setTheme('parent')">{{ $t("parents") }}</button>
  </div>
</template>
