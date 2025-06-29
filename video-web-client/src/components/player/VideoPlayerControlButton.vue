<script setup lang="ts">
import AppIcon from '../ui/AppIcon.vue'

const { icon } = defineProps<{ icon: string }>()
</script>

<template>
  <button type="button" class="video-player-control-button">
    <AppIcon :name="icon" />
  </button>
</template>

<style lang="scss" scoped>
.video-player-control-button {
  background: none;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.25rem;
  margin: 0.25rem;
}
</style>
