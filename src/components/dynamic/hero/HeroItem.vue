<script setup lang="ts">
import type { Slide } from "@/types/heroSlideItem";

defineProps<{
  slide: Slide;
}>();
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
          <a class="btn">&lt;</a>
          <a class="btn">&gt;</a>
        </div>
      </div>
    </div>
  </div>
</template>
