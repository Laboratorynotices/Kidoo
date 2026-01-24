<script setup lang="ts">
interface Props {
  title?: string;
  message?: string;
  variant?: "error" | "warning" | "info" | "success";
}

withDefaults(defineProps<Props>(), {
  title: "Alert",
  variant: "info",
});

const variantClasses = {
  error: "ui-alert--error",
  warning: "ui-alert--warning",
  info: "ui-alert--info",
  success: "ui-alert--success",
};
</script>

<template>
  <div :class="['ui-alert', variantClasses[variant]]" role="alert">
    <slot name="title">
      <p class="ui-alert__title">{{ title }}</p>
    </slot>

    <slot>
      <p v-if="message" class="ui-alert__message">{{ message }}</p>
    </slot>
  </div>
</template>
