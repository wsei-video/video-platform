<script setup lang="ts">
import { breakpointsBootstrapV5, useBreakpoints } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

import { useEditVideo } from '@/application/useEditVideo'
import { AppButton, AppIcon, AppInput } from '@/components/ui'
import {
  DropdownContent,
  DropdownItem,
  DropdownMenu,
  DropdownSeparator,
  DropdownTrigger,
} from '@/components/ui/dropdown'
import type { VideoUpdateCommand } from '@/domain/video'
import { useVideoUploadStore } from '@/store/video-upload.store'

import EditVideoSidebar from './EditVideoSidebar.vue'
import EditVideoThumbnailSection, { type ThumbnailApproach } from './EditVideoThumbnailSection.vue'

const { videoId } = defineProps<{
  videoId: string
}>()

const uplaodStore = useVideoUploadStore()
const breakpoints = useBreakpoints(breakpointsBootstrapV5)
const isMobile = breakpoints.smaller('md')
const pageMode = computed(() => (isMobile.value ? 'mobile' : 'desktop'))

const {
  initialVideoData,
  videoSourceData,
  mediaStreamsData,
  updateResult,
  error,
  isLoading,
  saveVideo,
  deleteVideo,
  pauseUpload,
  resumeUpload,
  abortUpload,
} = useEditVideo(videoId)

const tempVideo = ref<VideoUpdateCommand>({
  videoId,
  title: '',
  description: '',
  visibility: 'private',
})

watch(
  initialVideoData,
  (newInitialData) => {
    if (newInitialData && !tempVideo.value.title) {
      tempVideo.value = {
        videoId,
        title: newInitialData.title || '',
        description: newInitialData.description || '',
        visibility: newInitialData.visibility || 'private',
      }
    }
  },
  { immediate: true },
)

async function handleSave() {
  await saveVideo(tempVideo.value)
  if (error.value) {
    const fallbackData = updateResult.value || initialVideoData.value
    if (fallbackData) {
      tempVideo.value = {
        videoId,
        title: fallbackData.title,
        description: fallbackData.description,
        visibility: fallbackData.visibility,
      }
    }
  }
}

const thumbnailApproach = ref<ThumbnailApproach>('uploaded')
</script>

<template>
  <div :class="['edit-video', `edit-video--${pageMode}`]">
    <section class="edit-video__header">
      <h1 class="edit-video__title">Video details</h1>
      <div class="edit-video__header-actions">
        <AppButton @click="handleSave"><AppIcon name="save" />Save</AppButton>
        <DropdownMenu>
          <DropdownTrigger>
            <AppButton variant="secondary" class="edit-video__menu-btn">
              <AppIcon name="more_vert" />
            </AppButton>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem @click="pauseUpload">
              <AppIcon name="pause" />
              <p>Pause upload</p>
            </DropdownItem>
            <DropdownItem @click="resumeUpload">
              <AppIcon name="resume" />
              <p>Resume upload</p>
            </DropdownItem>
            <DropdownItem @click="abortUpload">
              <AppIcon name="cancel" />
              <p>Abort upload</p>
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem disabled>
              <AppIcon name="upload" />
              <p>Upload new video</p>
            </DropdownItem>
            <DropdownItem @click="() => deleteVideo(initialVideoData?.id ?? '')">
              <AppIcon name="delete" />
              <p>Delete video</p>
            </DropdownItem>
          </DropdownContent>
        </DropdownMenu>
      </div>
    </section>

    <div v-if="initialVideoData" class="edit-video__content">
      <main class="edit-video__main">
        <AppInput
          label="Title"
          placeholder="Add a title that describes your video"
          v-model="tempVideo.title"
        />
        <AppInput
          label="Description"
          as="textarea"
          rows="6"
          placeholder="Tell viewers about your video"
          v-model="tempVideo.description"
        />
        <EditVideoThumbnailSection :model="thumbnailApproach" />
      </main>
      <EditVideoSidebar
        v-if="mediaStreamsData"
        class="edit-video__sidebar"
        :videoData="initialVideoData"
        :video-source="videoSourceData"
        :media-streams="mediaStreamsData"
        v-model="tempVideo"
      />
      <p v-if="uplaodStore.isUploadPending">Progress: {{ uplaodStore.progress.percentage }}</p>
    </div>
    <p v-if="error">{{ error.message }}</p>
    <p v-if="isLoading">Loading...</p>
  </div>
</template>

<style scoped lang="scss">
@import '../../../styles/bootstrap/index.scss';

.edit-video {
  display: flex;
  flex-direction: column;
  max-width: min(1000px, 100vw);
  background-color: $body-bg-dark;

  &--mobile {
    .edit-video__header {
      padding: 1rem;
    }

    .edit-video__content {
      flex-direction: column;
      gap: 0.75rem;
      padding: 0 1rem 1rem;
    }

    .edit-video__sidebar {
      order: -1;
    }
  }

  &--desktop {
    .edit-video__header {
      padding: 1rem 1.5rem;
    }

    .edit-video__content {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 2rem;
      padding: 1.5rem;
    }
  }
}

.edit-video__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.edit-video__title {
  font-size: 1.25rem;
  font-weight: $font-weight-semibold;
  margin: 0;
}

.edit-video__header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.edit-video__menu-btn {
  padding: 0.5rem !important;
}

.edit-video__content {
  display: flex;
}

.edit-video__main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
