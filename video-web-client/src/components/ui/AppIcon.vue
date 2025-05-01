<script setup lang="ts">
const { name } = defineProps<{ name: string }>()
</script>

<template>
  <span class="material-symbols-sharp">{{ name }}</span>
</template>
