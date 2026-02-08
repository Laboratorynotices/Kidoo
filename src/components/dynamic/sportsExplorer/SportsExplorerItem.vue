<script setup lang="ts">
import type { Sport } from "@/types/sportsExplorer";
import SectionBlockHeading from "@/components/ui/SectionBlock/SectionBlockHeading.vue";
import UiTooltip from "@/components/ui/UiTooltip.vue";

interface Props {
  sport: Sport;
}

defineProps<Props>();
</script>

<template>
  <li class="sports-explorer__item">
    <UiTooltip class="sports-explorer__card">
      <div class="sports-explorer__emoji" aria-hidden="true">
        {{ sport.emoji }}
      </div>
      <SectionBlockHeading level="h4" class="sports-explorer__name">
        {{ sport.name }}
      </SectionBlockHeading>
      <template v-slot:tooltip>
        {{ sport.funFact }}
      </template>
    </UiTooltip>
  </li>
</template>
