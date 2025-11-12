<script setup lang="ts">
import { useDropZone, type UseDropZoneOptions } from '@vueuse/core'
import { useTemplateRef } from 'vue'

import { AppButton, AppIcon } from '.'

const props = withDefaults(
  defineProps<
    UseDropZoneOptions & {
      fileList?: boolean
    }
  >(),
  {
    fileList: true,
  },
)
const emit = defineEmits<{
  'file-change': [files: File[]]
}>()

const dropZoneRef = useTemplateRef('drop-zone')
const { files, isOverDropZone } = useDropZone(dropZoneRef, {
  ...props,
  onDrop: () => emit('file-change', files.value || []),
})

const removeFile = (index: number) => {
  if (!files.value) return
  files.value = files.value.filter((_, i) => i !== index)
}
</script>
<template>
  <div ref="drop-zone" class="drop-zone" :class="{ active: isOverDropZone }">
    <slot name="content" :isOverDropZone>Drop your files here, or click to select a file</slot>

    <ul v-if="files?.length && props.fileList" class="drop-zone__file-list">
      <li v-for="(file, index) in files" :key="index + file.name">
        <slot name="file-item" :file="file" :index="index" :remove="() => removeFile(index)">
          <span>{{ file.name }}</span>
          <span>{{ (file.size / 1024).toFixed(2) }} KB</span>
          <AppButton class="p-1 fs-8" outline @click.stop="removeFile(index)">
            <AppIcon name="close" />
          </AppButton>
        </slot>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.drop-zone {
  cursor: pointer;
  .active {
    background-color: red;
  }
}
</style>
