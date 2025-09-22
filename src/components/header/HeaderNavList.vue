<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import i18n, { type AvailableLocale } from "@/i18n";
import { apiGet } from "@/utils/apiUtils.ts";

// Композаблы
const { locale } = useI18n();

// Константы API
const MENU_ENDPOINT = "menu";

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

// Реактивные данные
const menuData = ref<MenuResponse | null>(null);

/**
 * API функция для получения Меню данных
 */
const fetchMenu = async (): Promise<MenuResponse> => {
  return apiGet<MenuResponse>(
    `${MENU_ENDPOINT}/${i18n.global.locale.value}.json`,
  );
};

// Функция загрузки меню
const loadMenu = async () => {
  try {
    const data = await fetchMenu();
    menuData.value = data;
  } catch (err) {
    console.error("Failed to load menu:", err);
  }
};

// Вычисляемые свойства
const currentLocale = computed(() => locale.value as AvailableLocale);
const menuList = computed(() =>
  menuData.value?.menu.sort((a, b) => a.order - b.order),
);

// Отслеживаем изменение локали
watch(
  currentLocale,
  () => {
    loadMenu();
  },
  { immediate: false },
);

// Загружаем меню при монтировании компонента
onMounted(() => {
  loadMenu();
});
</script>

<template>
  <ul class="header__menu-list">
    <li v-for="item in menuList" :key="item.id" class="header__menu-item">
      <a
        :href="item.url"
        class="header__menu-link"
        :class="{ active: item.order === 1 }"
        :aria-current="item.order === 1 ? 'page' : undefined"
      >
        {{ item.title }}
      </a>
    </li>
  </ul>
</template>
