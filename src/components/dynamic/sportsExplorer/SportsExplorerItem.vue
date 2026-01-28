<script setup lang="ts">
import type { Sport } from "@/types/sportsExplorer";
import SectionBlockHeading from "@/components/ui/SectionBlock/SectionBlockHeading.vue";

interface Props {
  sport: Sport;
}

defineProps<Props>();
</script>

<template>
  <li class="sports-explorer__item sports-explorer__item--card">
    <div class="sports-explorer__emoji" aria-hidden="true">
      {{ sport.emoji }}
    </div>
    <SectionBlockHeading level="h4" class="sports-explorer__name">
      {{ sport.name }}
    </SectionBlockHeading>
    <p class="sports-explorer__fact">{{ sport.funFact }}</p>
  </li>
</template>
