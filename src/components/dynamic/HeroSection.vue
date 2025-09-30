<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { HeroSlidesResponse } from "@/types/heroSlides";
import HeroItem from "./hero/HeroItem.vue";
import i18n, { type AvailableLocale } from "@/i18n";
import { apiGet } from "@/utils/apiUtils.ts";

// Композаблы
const { locale } = useI18n();

// Константы API
const HERO_ENDPOINT = "hero-slides";

// Реактивные данные
const heroData = ref<HeroSlidesResponse | null>(null);

/**
 * API функция для получения данных Hero секции
 */
const fetchHero = async (): Promise<HeroSlidesResponse> => {
  return apiGet<HeroSlidesResponse>(
    `${HERO_ENDPOINT}/${i18n.global.locale.value}.json`,
  );
};

// Функция загрузки меню
const loadHero = async () => {
  try {
    const data = await fetchHero();
    heroData.value = data;
  } catch (err) {
    console.error("Failed to load menu:", err);
  }
};

// Вычисляемые свойства
const currentLocale = computed(() => locale.value as AvailableLocale);

// Отслеживаем изменение локали
watch(
  currentLocale,
  () => {
    loadHero();
  },
  { immediate: false },
);

// Загружаем меню при монтировании компонента
onMounted(() => {
  loadHero();
});
</script>

<template>
  <div class="hero">
    <div class="carousel">
      <HeroItem
        v-for="(slide, index) in heroData?.slides"
        :key="index"
        :slide="slide"
      />
    </div>
  </div>
</template>
