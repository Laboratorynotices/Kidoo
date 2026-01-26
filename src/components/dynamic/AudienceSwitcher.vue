<script setup lang="ts">
import { onMounted } from "vue";
import { useTheme } from "@/composables/useTheme";
import { useLayout } from "@/composables/layout";
import { useAudienceSwitcherTranslations } from "@/composables/useAudienceSwitcherTranslations";
import type { BodyMode } from "@/types/theme";
import AudienceSwitcherItem from "./audienceSwitcher/AudienceSwitcherItem.vue";
import SectionBlock from "@/components/ui/SectionBlock/SectionBlock.vue";
import UiAlert from "@/components/ui/UiAlert.vue";

const { setTheme, currentTheme } = useTheme();
const { fetchConfigs } = useLayout();

const { introduceYourself, loadError, syncWithI18n } =
  useAudienceSwitcherTranslations();

const audiences: BodyMode[] = ["child", "family", "parent"];

const handleThemeChange = async (theme: BodyMode) => {
  if (currentTheme.value === theme) return;

  setTheme(theme);
  await fetchConfigs(theme);
};

// Загружаем переводы при монтировании компонента
onMounted(async () => {
  await syncWithI18n();
});
</script>

<template>
  <div class="container">
    <!-- Сообщение об ошибке -->
    <UiAlert v-if="loadError" variant="error">
      <template #title>{{ $t("errors.contentLoadFailed") }}</template>
      <template>
        <p>{{ loadError }}</p>
      </template>
    </UiAlert>

    <!-- Основной контент -->
    <SectionBlock
      v-else
      id="audience-switcher"
      class="audience-switcher"
      role="radiogroup"
      aria-labelledby="audience-switcher-title"
      titleId="audience-switcher-title"
    >
      <template #subtitle>{{ introduceYourself?.subtitle }}</template>

      <template #title>{{ introduceYourself?.title }}</template>

      <template #description>
        {{ introduceYourself?.description }}
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
