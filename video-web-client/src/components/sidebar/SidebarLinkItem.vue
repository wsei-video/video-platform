<script setup lang="ts">
import { AppIcon } from '@/components/ui'

defineProps<{ icon?: string; to: string }>()
</script>

<template>
  <RouterLink :to="to" custom v-slot="{ navigate, href }" class="text-decoration-none text-white">
    <a
      @click="navigate"
      :href="href"
      class="fw-bold sidebar-link"
      :class="{ selected: $route.path.includes(to) }"
    >
      <AppIcon v-if="icon" :name="icon" class="sidebar-link-icon" />
      <span class="sidebar-link-description"><slot /></span>
    </a>
  </RouterLink>
</template>

<style lang="scss">
@import '../../styles/bootstrap/index.scss';

.sidebar-link {
  display: flex;
  text-decoration: none;
  gap: 1rem;
  align-items: center;
  padding: 0.625rem;
  width: 100%;
  border-radius: 8px;
  color: $inactive-link;

  &:hover,
  &.selected {
    background-color: $accent;
    color: $white;
    cursor: pointer;
  }

  .sidebar-link-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .sidebar-link-description {
    flex-grow: 1;
  }
}
</style>
