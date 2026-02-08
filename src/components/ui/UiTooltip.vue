<template>
  <div class="tooltip" tabindex="0">
    <slot />
    <div class="tooltip__content" role="tooltip" aria-hidden="true">
      <slot name="tooltip" />
    </div>
  </div>
</template>
