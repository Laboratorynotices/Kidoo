<script setup lang="ts">
import { useI18n } from "vue-i18n";

import { getNextLocale, switchLocale } from "@/i18n";

const { locale } = useI18n();
</script>

<template>
  <button
    @click="switchLocale"
    :aria-label="$t('switch language')"
    :title="$t('switch language')"
    class="header__lang-switcher lang-switcher"
    type="button"
  >
    <img
      v-if="locale === 'ru'"
      src="@/assets/imgs/locale/ru.webp"
      :alt="$t('russian')"
      :title="$t('switch to ' + getNextLocale())"
    />
    <img
      v-else-if="locale === 'de'"
      src="@/assets/imgs/locale/de.webp"
      :alt="$t('german')"
      :title="$t('switch to ' + getNextLocale())"
    />
    <img
      v-else
      src="@/assets/imgs/locale/en.webp"
      :alt="$t('english')"
      :title="$t('switch to ' + getNextLocale())"
    />
  </button>
</template>
