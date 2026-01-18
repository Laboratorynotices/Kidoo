<script setup lang="ts">
import { ref, watch, inject } from "vue";
import type { Slide } from "@/types/heroSlideItem";
import { HERO_CAROUSEL_KEY } from "@/keys/heroCarouselKeys";

// Пропсы
const props = defineProps<{
  slide: Slide;
}>();

// Методы управления каруселью из родителя
const carousel = inject(HERO_CAROUSEL_KEY);

// Обработчики кликов
const handleNext = () => carousel?.next();
const handlePrev = () => carousel?.prev();

// ref для background-image
const bgImage = ref<string>("");

// Ленивый импорт всех изображений в папке
const images = import.meta.glob(
  "@/assets/imgs/hero/*.{jpg,jpeg,png,gif,webp}",
  { eager: false },
);

// Функция загрузки конкретного изображения
const loadImage = async (name: string) => {
  if (!name) {
    bgImage.value = "";
    return;
  }

  const entry = Object.entries(images).find(([path]) => path.endsWith(name));
  if (entry) {
    try {
      // Явно указываем тип модуля
      const module = (await entry[1]()) as { default: string };
      bgImage.value = module.default;
    } catch (err) {
      console.error("Ошибка загрузки изображения:", name, err);
      bgImage.value = "";
    }
  } else {
    console.warn("Изображение не найдено:", name);
    bgImage.value = "";
  }
};

// Загружаем изображение при изменении слайда
watch(
  () => props.slide.image,
  (newImage) => {
    loadImage(newImage);
  },
  { immediate: true },
);
</script>

<template>
  <div
    class="item"
    :style="bgImage ? { backgroundImage: `url(${bgImage})` } : {}"
  >
    <div class="container">
      <div class="content">
        <div class="title">{{ slide.title }}</div>
        <div class="name">{{ slide.name }}</div>
        <div class="description">{{ slide.description }}</div>
        <div class="buttoms">
          <a :href="slide.btn.link" class="btn">{{ slide.btn.text }}</a>
          <a class="btn" @click="handlePrev" type="button">&lt;</a>
          <a class="btn" @click="handleNext" type="button">&gt;</a>
        </div>
      </div>
    </div>
  </div>
</template>
