<script setup lang="ts">
import { provide, ref } from 'vue'

import { DropdownKey } from './index'

const isOpen = ref(false)

const toggle = () => (isOpen.value = !isOpen.value)
const close = () => (isOpen.value = false)

provide(DropdownKey, { isOpen, toggle, close })
</script>

<template>
  <div v-click-outside="close" class="menu-dropdown">
    <slot />
  </div>
</template>

<style scoped>
.menu-dropdown {
  position: relative;
  display: inline-flex;
  align-items: center;
}
</style>
