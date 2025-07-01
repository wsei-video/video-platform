<script setup lang="ts">
import AppIcon from '../ui/AppIcon.vue'

const {
  icon = null,
  label,
  selected = false,
} = defineProps<{ icon?: string | null; label: string; selected?: boolean }>()
</script>

<template>
  <button class="video-player-menu-item">
    <div class="video-player-menu-item-content">
      <div class="video-player-menu-item-icon">
        <AppIcon v-if="icon || selected" :name="icon ?? 'check'" />
      </div>
      <div class="video-player-menu-item-label">{{ label }}</div>
    </div>
    <div>
      <slot></slot>
    </div>
  </button>
</template>

<style lang="scss" scoped>
.video-player-menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background-color: transparent;
  border: 0;
  width: 100%;

  &:hover,
  &:focus-visible {
    background-color: rgba(255, 255, 255, 0.15);
  }
}

.video-player-menu-item-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.video-player-menu-item-icon {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 1.75rem;
  height: 1.75rem;
}
</style>
