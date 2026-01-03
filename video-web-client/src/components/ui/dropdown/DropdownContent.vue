<script setup lang="ts">
import { inject } from 'vue'

import { DropdownKey } from './index'

const context = inject(DropdownKey)
if (!context) throw new Error('DropdownContent must be used within DropdownMenu')

const { isOpen } = context
</script>

<template>
  <transition name="fade">
    <div v-if="isOpen" class="dropdown-content">
      <slot />
    </div>
  </transition>
</template>

<style lang="scss">
@import '../../../styles/bootstrap/index.scss';
.dropdown-content {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  min-width: 220px;
  font-family: sans-serif;
  font-size: 0.875rem;
  background-color: $accent;
  border: 1px solid $secondary;
  z-index: $zindex-popup;
}

/* Simple Fade Animation */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
