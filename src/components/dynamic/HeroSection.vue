<script setup lang="ts">
import { computed, onMounted, ref, watch, provide } from "vue";
import { useI18n } from "vue-i18n";
import type { HeroSlidesResponse } from "@/types/heroSlides";
import HeroItem from "./hero/HeroItem.vue";
import HeroProgressBar from "./hero/HeroProgressBar.vue";
import i18n, { type AvailableLocale } from "@/i18n";
import { apiGet } from "@/utils/apiUtils.ts";
import { useHeroCarousel } from "@/composables/useHeroCarousel";
import { HERO_CAROUSEL_KEY } from "@/keys/heroCarouselKeys";

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
    console.error("Failed to load hero:", err);
  }
};

// Вычисляемые свойства
const currentLocale = computed(() => locale.value as AvailableLocale);
const slidesData = computed(() => heroData.value?.slides ?? []);

// Инициализация carousel с настройками
const {
  orderedSlides,
  next,
  prev,
  pauseAutoplay,
  resumeAutoplay,
  autoplayProgress,
} = useHeroCarousel(slidesData, {
  autoplay: true,
  autoplayInterval: 5000,
  transitionDuration: 1000,
});

// Предоставляем методы управления каруселью для дочерних компонентов
provide(HERO_CAROUSEL_KEY, {
  next,
  prev,
  pauseAutoplay,
  resumeAutoplay,
  autoplayProgress,
});

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

// Экспортируем методы для использования в HeroItem
defineExpose({
  next,
  prev,
});
</script>

<template>
  <div class="hero" @mouseenter="pauseAutoplay" @mouseleave="resumeAutoplay">
    <div class="carousel">
      <HeroItem
        v-for="({ slide, originalIndex }, position) in orderedSlides"
        :key="originalIndex"
        :slide="slide"
        :data-position="position"
        :style="{
          zIndex: position === 0 ? 1 : position === 1 ? 2 : 3 + position,
        }"
      />
    </div>

    <!-- Прогресс-бар автопрокрутки -->
    <HeroProgressBar />
  </div>
</template>
