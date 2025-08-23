<script setup lang="ts">
const emojis = ['😀', '😎', '🥶', '😓', '🫣']

const emit = defineEmits<{
  'emoji-selected': [value: string]
}>()
</script>
<template>
  <div class="emoji-picker">
    <div class="emoji-picker__grid">
      <button
        v-for="emoji in emojis"
        :key="emoji"
        class="emoji-picker__grid__emoji-button"
        @click="emit('emoji-selected', emoji)"
      >
        {{ emoji }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../../styles/bootstrap/index.scss';

.emoji-picker {
  position: absolute;
  top: calc(100% + 1rem);
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;

  border-radius: $border-radius-md;
  background-color: $accent;
}

.emoji-picker__grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 0.25rem;
}

.emoji-picker__grid__emoji-button {
  border: none;
  background-color: transparent;
  padding: 0.25rem;
}
</style>
