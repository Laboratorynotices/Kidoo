<script setup lang="ts">
import type { BodyMode } from "@/types/theme";

defineProps<{
  audience: BodyMode;
  current: BodyMode;
}>();

defineEmits<{
  (e: "select", value: BodyMode): void;
}>();
</script>

<template>
  <li
    class="audience-switcher__item"
    role="radio"
    :aria-checked="current === audience"
    :tabindex="current === audience ? 0 : -1"
    @click="$emit('select', audience)"
    @keydown.space.prevent="$emit('select', audience)"
    @keydown.enter.prevent="$emit('select', audience)"
  >
    <button class="audience-switcher__button">
      {{ $t(audience) }}
    </button>
  </li>
</template>
