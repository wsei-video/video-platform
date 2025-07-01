<script setup lang="ts">
import AppIcon from '../ui/AppIcon.vue'

const { icon, iconRotation = 0 } = defineProps<{ icon: string; iconRotation?: number }>()
</script>

<template>
  <button type="button" class="video-player-control-button">
    <AppIcon
      class="video-player-control-button-icon"
      :name="icon"
      :style="{ transform: `rotate(${iconRotation}deg)` }"
    />
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

.video-player-control-button-icon {
  transition: transform 0.15s ease-out;
}
</style>
