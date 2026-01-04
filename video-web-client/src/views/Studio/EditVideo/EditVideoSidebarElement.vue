<script setup lang="ts">
import { AppIcon } from '@/components/ui'

defineProps<{
  icon: string
}>()
</script>
<template>
  <div class="edit-video__sidebar-item">
    <div class="edit-video__sidebar-item-header">
      <AppIcon :name="icon" />
      <span><slot name="title"></slot></span>
    </div>
    <div class="edit-video__sidebar-item-content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../../../styles/bootstrap/index.scss';

.edit-video__sidebar-item {
  background-color: $secondary;
  border-radius: $border-radius-md;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &--clickable {
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: $accent;
    }
  }
}

.edit-video__sidebar-item-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
}

.edit-video__sidebar-item-content {
  margin-left: 1rem;
}
</style>
