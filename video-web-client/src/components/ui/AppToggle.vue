<script setup lang="ts">
import { useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const model = defineModel<boolean>()

const { label } = defineProps<{
  label?: string
}>()
</script>

<template>
  <div class="form-check form-switch">
    <input class="form-check-input" type="checkbox" role="switch" v-bind="attrs" v-model="model" />
    <label v-if="label" class="form-check-label" :for="attrs.id as string">
      {{ label }}
    </label>
  </div>
</template>

<style scoped></style>
