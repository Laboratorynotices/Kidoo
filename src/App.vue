<script setup lang="ts">
import { switchLocale } from "./i18n";
</script>

<template>
  <div>
    <p>{{ $t("hello") }}</p>
    <button @click="switchLocale">Switch language</button>
  </div>
</template>
