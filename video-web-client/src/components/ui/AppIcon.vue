<script setup lang="ts">
export type IconName = string
defineProps<{ name: IconName }>()
</script>

<template>
  <span class="material-symbols-sharp">{{ name }}</span>
</template>
