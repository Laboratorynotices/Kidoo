<script setup lang="ts">
import HeaderNavList from "./HeaderNavList.vue";

// Props
// isMenuActive управляется из родительского компонента (например, через клик по бургер-иконке)
defineProps({
  isMenuActive: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <nav
    class="header__menu navbar-menu"
    :class="{ active: isMenuActive }"
    id="navbar-menu"
    :aria-label="$t('aria.nav.main')"
  >
    <HeaderNavList />
  </nav>
</template>
