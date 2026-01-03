<script setup lang="ts">
import { inject } from 'vue'

import { DropdownKey } from './index'

const context = inject(DropdownKey)

if (!context) throw new Error('DropdownTrigger must be used within DropdownMenu')

const { toggle } = context
</script>

<template>
  <div @click="toggle" class="dropdown-trigger">
    <slot />
  </div>
</template>

<style scoped>
.dropdown-trigger {
  cursor: pointer;
  display: inline-flex;
}
</style>
