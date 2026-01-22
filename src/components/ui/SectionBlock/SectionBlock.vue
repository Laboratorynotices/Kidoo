<script setup lang="ts">
import SectionBlockHeading from "./SectionBlockHeading.vue";
import SectionBlockDescription from "./SectionBlockDescription.vue";

const props = defineProps<{
  id?: string;
  class?: string;
}>();
</script>

<template>
  <section :id="id" :class="['section-block', props.class]">
    <header class="section-block__header">
      <SectionBlockHeading level="h2" class="section-block__title">
        <slot name="title" />
      </SectionBlockHeading>

      <SectionBlockHeading level="h3" class="section-block__subtitle">
        <slot name="subtitle" />
      </SectionBlockHeading>

      <SectionBlockDescription
        v-if="$slots.description"
        class="section-block__description"
      >
        <slot name="description" />
      </SectionBlockDescription>
    </header>

    <div class="section-block__content">
      <slot />
    </div>
  </section>
</template>
