<script setup lang="ts"></script>
<template>
  <button class="video-reaction"><slot /></button>
</template>

<style scoped lang="scss">
@import '../../styles/bootstrap/index.scss';

.video-reaction {
  position: relative;
  display: flex;
  align-items: center;
  border: none;
  background-color: $accent;
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  border-radius: $border-radius-md;
}
</style>
