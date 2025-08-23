<script setup lang="ts"></script>
<template>
  <button class="video-reaction"><slot /></button>
</template>

<style scoped lang="scss">
.video-reaction {
  position: relative;
  border: none;
  background-color: transparent;
  display: inline-flex;
}
</style>
