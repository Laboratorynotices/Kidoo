<script setup lang="ts">
import { inject } from "vue";
import type { Slide } from "@/types/heroSlideItem";
import { HERO_CAROUSEL_KEY } from "@/keys/heroCarouselKeys";

// Пропсы
defineProps<{
  slide: Slide;
}>();

// Получаем методы управления каруселью из родителя
const carousel = inject(HERO_CAROUSEL_KEY);

// Обработчики кликов по кнопкам навигации
const handleNext = () => {
  carousel?.next();
};

const handlePrev = () => {
  carousel?.prev();
};
</script>

<template>
  <div
    class="item"
    :style="`background-image: url(/src/assets/imgs/hero/${slide.image});`"
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
