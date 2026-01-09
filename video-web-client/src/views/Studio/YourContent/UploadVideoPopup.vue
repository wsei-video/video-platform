<script setup lang="ts">
import { UploadDropZone } from '@/components/ui'
import AppButton from '@/components/ui/AppButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import UploadInput from '@/components/ui/UploadInput.vue'
import { useVideoUploadStore } from '@/store/video-upload.store'

const uploadStore = useVideoUploadStore()
const show = defineModel<boolean>()

const emit = defineEmits<{
  'files-selected': [files: File[]]
}>()

function onFileSelect(files: File[]) {
  if (files.length < 1) {
    console.log('no files to upload')
    return
  }
  console.log('Files to upload: ', files)
  emit('files-selected', files)
}

const uploadProps = {
  multiple: false,
  dataTypes: ['video/mp4'],
}
</script>
<template>
  <transition name="nested">
    <div v-if="show" class="backdrop popup-backdrop outer" @click="show = false">
      <div
        class="app-popup upload-popup inner bg-secondary d-flex flex-column shadow-sm rounded-4"
        @click.stop
      >
        <div
          class="upload-popup__header d-flex flex-row align-items-center justify-content-between px-4 py-4"
        >
          <h2 class="upload-popup__title fs-4 fw-semibold">Upload video</h2>
          <AppButton variant="secondary" class="upload-popup__close fs-4 p-2" @click="show = false">
            <AppIcon name="close" />
          </AppButton>
        </div>
        <div class="upload-popup__body p-4">
          <UploadInput @file-change="onFileSelect" v-bind="uploadProps" :multiple="true">
            <UploadDropZone
              @file-change="onFileSelect"
              :file-list="false"
              :prevent-default-for-unhandled="true"
              v-bind="uploadProps"
            >
              <template #content="{ isOverDropZone }">
                <div
                  class="upload-area d-flex flex-column align-items-center justify-content-center rounded-4"
                  :class="{ 'upload-area--active': isOverDropZone }"
                >
                  <div
                    class="upload-icon d-flex justify-content-center align-items-center rounded-circle mb-4"
                  >
                    <AppIcon name="upload" />
                  </div>
                  <h3 class="upload-heading mb-1 fs-4">Drag and drop video files to upload</h3>
                  <p class="upload-subtext mb-4">
                    Your videos will be private until you publish them.
                  </p>
                  <AppButton variant="primary" class="upload-button px-3 py-2 fs-6 fw-semibold"
                    >Select files</AppButton
                  >
                  <p v-if="uploadStore.setupError">{{ uploadStore.setupError.message }}</p>
                  <p v-if="uploadStore.isSetupLoading">Loading...</p>
                </div>
              </template>
            </UploadDropZone>
          </UploadInput>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
@import '../../../styles/bootstrap/index.scss';

.upload-popup {
  max-width: 600px;
  width: 90vw;

  &__header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  &__close {
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}

.upload-area {
  padding: 4rem 2rem;
  background-color: $body-bg-dark;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    background-color: rgba($body-bg-dark, 0.5);
  }

  &--active {
    border-color: $primary;
    background-color: rgba($body-bg-dark, 0.5);
  }
}

.upload-icon {
  width: 120px;
  height: 120px;
  background-color: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.5);
}

.upload-subtext {
  color: rgba(255, 255, 255, 0.6);
}
</style>
