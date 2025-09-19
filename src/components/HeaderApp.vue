<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { AvailableLocale } from "@/i18n";

// Константы API
const API_MENU_URL = "/api/v1/menu";

// Типы
interface MenuItem {
  id: string;
  title: string;
  url: string;
  order: number;
}

interface MenuResponse {
  language: AvailableLocale;
  menu: MenuItem[];
}

// Композаблы
const { locale } = useI18n();

// Реактивные данные
const menuData = ref<MenuResponse | null>(null);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

// Вычисляемые свойства
const currentLocale = computed(() => locale.value as AvailableLocale);

// API функция для реального запроса
const fetchMenu = async (language: AvailableLocale): Promise<MenuResponse> => {
  const response = await fetch(`${API_MENU_URL}/${language}.json`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch menu: ${response.status} ${response.statusText}`,
    );
  }

  const data: MenuResponse = await response.json();
  return data;
};

// Функция загрузки меню
const loadMenu = async (language: AvailableLocale) => {
  loading.value = true;
  error.value = null;

  try {
    const data = await fetchMenu(language);
    menuData.value = data;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unknown error";
    console.error("Failed to load menu:", err);
  } finally {
    loading.value = false;
  }
};

// Отслеживаем изменение локали
watch(
  currentLocale,
  (newLocale) => {
    loadMenu(newLocale);
  },
  { immediate: false },
);

// Загружаем меню при монтировании компонента
onMounted(() => {
  loadMenu(currentLocale.value);
});
</script>

<template>
  <header class="header">
    <div class="container">
      <h1>Header Component</h1>

      <!-- Отладочная информация -->
      <div class="debug-info">
        <p>Current locale: {{ currentLocale }}</p>
        <p>Loading: {{ loading }}</p>
        <p>Error: {{ error }}</p>
      </div>

      <!-- Сырой вывод ответа API -->
      <div class="menu-raw" v-if="menuData">
        <h3>Raw API Response:</h3>
        <pre>{{ JSON.stringify(menuData, null, 2) }}</pre>
      </div>

      <!-- Загрузка -->
      <div v-if="loading" class="loading">Loading menu...</div>

      <!-- Ошибка -->
      <div v-if="error" class="error">Error: {{ error }}</div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: #f8f9fa;
  padding: 1rem 0;
  border-bottom: 1px solid #dee2e6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.debug-info {
  background-color: #e9ecef;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  font-family: monospace;
}

.menu-raw {
  background-color: #f1f3f4;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}

.menu-raw pre {
  margin: 0;
  white-space: pre-wrap;
  font-size: 0.875rem;
  line-height: 1.5;
}

.loading {
  color: #6c757d;
  font-style: italic;
  padding: 1rem;
}

.error {
  color: #dc3545;
  background-color: #f8d7da;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
}

h1 {
  color: #343a40;
  margin-bottom: 1rem;
}

h3 {
  color: #495057;
  margin-bottom: 0.5rem;
}
</style>
