<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    mode?: 'fullscreen' | 'overlay' | 'inline'
  }>(),
  {
    mode: 'fullscreen',
  },
)

const containerClasses = computed(() => {
  switch (props.mode) {
    case 'fullscreen':
      return 'backdrop'
    case 'overlay':
      return 'spinner-overlay'
    case 'inline':
      return 'spinner-inline'
    default:
      return 'backdrop'
  }
})

const wrapperClasses = computed(() => {
  return props.mode === 'fullscreen' ? 'app-popup' : ''
})
</script>

<template>
  <div :class="containerClasses">
    <div :class="wrapperClasses">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../styles/bootstrap/index.scss';

.spinner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: $zindex-spinner;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: inherit;
}

.spinner-inline {
  width: 100%;
  height: 100%;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
