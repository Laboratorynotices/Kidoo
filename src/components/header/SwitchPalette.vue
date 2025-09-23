<script setup lang="ts">
// Импортируем компосабл с новой логикой
import { useTheme } from "@/composables/useTheme";

// Получаем все необходимое из композабла
const {
  isChildModeActive,
  isParentModeActive,
  toggleChildFlag,
  toggleParentFlag,
} = useTheme();
</script>

<template>
  <div
    class="header__switcher-palette palette_switcher"
    role="group"
    :aria-label="$t('header.switcher.groupLabel')"
  >
    <!-- 
      ВАЖНО: Логика намеренно перекрестная - иконка ребенка управляет состоянием родителя и наоборот.
    -->
    <a
      @click="toggleParentFlag()"
      role="button"
      tabindex="0"
      :aria-pressed="isChildModeActive"
      :aria-label="$t('header.switcher.childMode')"
    >
      <img
        src="@/assets/icons/nav-child.svg"
        :alt="$t('header.switcher.childIconAlt')"
        class="palette_switcher__icon palette_switcher__icon--child"
        :class="{ active: isChildModeActive }"
    /></a>
    <a
      @click="toggleChildFlag()"
      role="button"
      tabindex="0"
      :aria-pressed="isParentModeActive"
      :aria-label="$t('header.switcher.parentMode')"
    >
      <img
        src="@/assets/icons/nav-parent.svg"
        :alt="$t('header.switcher.parentIconAlt')"
        class="palette_switcher__icon palette_switcher__icon--parent"
        :class="{ active: isParentModeActive }"
    /></a>
  </div>
</template>
