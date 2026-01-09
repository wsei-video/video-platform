<script setup lang="ts">
import { useTemplateRef } from 'vue'

const props = withDefaults(
  defineProps<{
    dataTypes?: string[]
    multiple?: boolean
    disabled?: boolean
  }>(),
  {
    multiple: false,
    disabled: false,
  },
)

const inputRef = useTemplateRef('file-input')

const emit = defineEmits<{
  'file-change': [files: File[]]
}>()

const inputTrigger = () => {
  if (props.disabled) return
  inputRef.value?.click()
}

const onInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    emit('file-change', [...target.files])
  }
}
</script>
<template>
  <div>
    <div ref="file-input" @click.stop="inputTrigger">
      <slot></slot>
    </div>
    <input
      @change="onInputChange"
      :accept="dataTypes?.join(', ')"
      :multiple="multiple"
      :disabled="disabled"
      ref="file-input"
      type="file"
      class="visually-hidden"
    />
  </div>
</template>

<style scoped></style>
