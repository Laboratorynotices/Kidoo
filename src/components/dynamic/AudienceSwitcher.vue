<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";
import { useLayout } from "@/composables/layout";
import type { BodyMode } from "@/types/theme";
import AudienceSwitcherItem from "./audienceSwitcher/AudienceSwitcherItem.vue";
import SectionBlock from "@/components/ui/SectionBlock/SectionBlock.vue";

const { setTheme, currentTheme } = useTheme();
const { fetchConfigs } = useLayout();

const audiences: BodyMode[] = ["child", "family", "parent"];

const handleThemeChange = async (theme: BodyMode) => {
  if (currentTheme.value === theme) return;

  setTheme(theme);
  await fetchConfigs(theme);
};
</script>

<template>
  <div class="container">
    <SectionBlock
      id="audience-switcher"
      class="audience-switcher"
      role="radiogroup"
      aria-labelledby="audience-switcher-title"
      titleId="audience-switcher-title"
    >
      <!-- Просто передаём текст в именованные слоты -->
      <template #subtitle>{{ $t("introduceYourself.subtitle") }}</template>

      <template #title>{{ $t("introduceYourself.title") }}</template>

      <template #description>
        {{ $t("introduceYourself.description") }}
      </template>

      <!-- Основной контент секции -->
      <ul class="audience-switcher__list">
        <AudienceSwitcherItem
          v-for="audience in audiences"
          :key="audience"
          :audience="audience"
          :current="currentTheme"
          @select="handleThemeChange"
        />
      </ul>
    </SectionBlock>
  </div>
</template>
