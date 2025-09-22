<script setup lang="ts">
import { ref } from "vue";
import HeaderSwitchers from "./HeaderSwitchers.vue";
import HeaderToggleMenu from "./HeaderToggleMenu.vue";
import HeaderNav from "./HeaderNav.vue";

// Для управления состоянием меню
const isMenuActive = ref<boolean>(false);

const closeMenu = () => {
  isMenuActive.value = false;
};
</script>

<template>
  <header class="header">
    <div class="header__container container">
      <a
        href="#"
        class="header__logo navbar-logo"
        :aria-label="$t('aria.nav.toTop')"
        >Kidoo</a
      >

      <HeaderSwitchers />

      <HeaderToggleMenu v-model="isMenuActive" />

      <HeaderNav :is-menu-active="isMenuActive" @click="closeMenu" />
    </div>
  </header>
</template>
