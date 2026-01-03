<script setup lang="ts">
import { inject } from 'vue'

import { DropdownKey } from './index'

const props = defineProps<{
  disabled?: boolean
}>()

const context = inject(DropdownKey)
const { close } = context!

const handleClick = () => {
  if (props.disabled) return
  close()
}
</script>

<template>
  <div class="app-dropdown-item" :class="{ disabled: disabled }" @click="handleClick">
    <slot />
  </div>
</template>

<style scoped lang="scss">
@import '../../../styles/bootstrap/index.scss';

.app-dropdown-item {
  display: flex;
  cursor: pointer;
  transition: background-color 0.1s;
  align-items: center;
  gap: 1rem;
  padding: 0.25rem 0.5rem;

  &:hover {
    background-color: $secondary;
  }
}

.app-dropdown-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
