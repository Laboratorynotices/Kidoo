<script setup lang="ts">
import { onMounted } from "vue";
import { useSportsExplorerTranslations } from "@/composables/useSportsExplorerTranslations";
import SectionBlock from "@/components/ui/SectionBlock/SectionBlock.vue";
import UiAlert from "@/components/ui/UiAlert.vue";
import SportsExplorerItem from "./sportsExplorer/SportsExplorerItem.vue";

const { sportsExplorer, loadError, syncWithI18n } =
  useSportsExplorerTranslations();

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
      v-else-if="sportsExplorer"
      id="sports-explorer"
      class="sports-explorer"
      titleId="sports-explorer-title"
      aria-labelledby="sports-explorer-title"
    >
      <template #subtitle aria-hidden="true">{{
        sportsExplorer.icon
      }}</template>
      <template #title>{{ sportsExplorer.title }}</template>
      <template #description>
        {{ sportsExplorer.description }}
      </template>

      <!-- Список видов спорта -->
      <ul class="sports-explorer__list">
        <SportsExplorerItem
          v-for="(sport, index) in sportsExplorer.sports"
          :key="`${sport.name}-${index}`"
          :sport="sport"
        />
      </ul>

      <!-- Заключительная фраза -->
      <div class="sports-explorer__closing">
        <p class="sports-explorer__closing-text">
          {{ sportsExplorer.closing.text }}
        </p>
        <div class="sports-explorer__icons">
          <span
            v-for="(icon, index) in sportsExplorer.closing.icons"
            :key="`closing-icon-${index}`"
            class="sports-explorer__icon"
            aria-hidden="true"
          >
            {{ icon }}
          </span>
        </div>
      </div>
    </SectionBlock>
  </div>
</template>
