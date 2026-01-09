<script setup lang="ts">
import { breakpointsBootstrapV5, useBreakpoints } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useGetYourContent } from '@/application/queries/video/useGetYourContent'
import { AppButton, AppIcon, UploadInput } from '@/components/ui'
import { VideosGrid } from '@/components/video'
import { flattenPagination } from '@/infrastructure/video-api/shared/utils'
import { useChannelStore } from '@/store'
import { useVideoUploadStore } from '@/store/video-upload.store'

import UploadVideoPopup from './UploadVideoPopup.vue'
import VideosTable from './VideosTable.vue'

const breakpoints = useBreakpoints(breakpointsBootstrapV5)
const isTableLayout = breakpoints.greater('lg')
const isMobile = breakpoints.smaller('md')
const showUploadPopup = ref(false)
const router = useRouter()

const channelStore = useChannelStore()
const uploadStore = useVideoUploadStore()

const { data: videos, isLoading: videosIsPending, error: videosError } = useGetYourContent()
const channelVideos = computed(() => flattenPagination(videos.value))

const isPageLoading = computed(() => channelStore.isFetchingChannels || videosIsPending.value)
const pageError = computed(() => channelStore.fetchChannelsError || videosError.value)

const noChannelAssigned = computed(
  () => !channelStore.isFetchingChannels && !channelStore.selectedChannelId && !pageError.value,
)
const noChannelContent = computed(
  () =>
    !channelStore.isFetchingChannels &&
    !videosIsPending.value &&
    channelStore.selectedChannelId &&
    channelVideos.value.length < 1,
)

const onFileUpload = async (files: File[]) => {
  if (files.length < 1) {
    console.log('no files to upload')
    return
  }
  console.log('Files to upload: ', files)

  const video = await uploadStore.handleUpload(files[0])
  router.push({
    name: 'edit-video',
    params: { videoId: video.id },
  })
}
</script>
<template>
  <div class="your-content">
    <section v-click-guard="noChannelAssigned || !!pageError" class="your-content__header">
      <h1 class="your-content__header__title">Your Content</h1>
      <UploadInput v-if="isMobile" @file-change="onFileUpload" multiple :data-types="['video/*']">
        <AppButton :disabled="noChannelAssigned || !!pageError" class="your-content__header__btn"
          ><AppIcon name="add" />Upload video</AppButton
        >
      </UploadInput>
      <AppButton
        v-else
        @click="showUploadPopup = true"
        :disabled="noChannelAssigned || !!pageError"
        class="your-content__header__btn"
        ><AppIcon name="add" />Upload video
      </AppButton>
    </section>
    <section class="your-content__videos">
      <h2 v-if="!noChannelAssigned" class="fs-4 fw-bolder">
        Channel: <span class="text-primary">{{ channelStore.getSelectedChannel?.name }}</span>
      </h2>
      <div v-if="noChannelAssigned">
        <p class="fs-4">You have no channel assigned :(</p>
        <p class="fs-5 mb-3">Go to your setting page and create new channel</p>
        <AppButton @click="router.push({ name: 'account-settings' })"
          ><AppIcon name="settings_b_roll" />Account Settings</AppButton
        >
      </div>
      <div v-else-if="noChannelContent">This channel does not have any content</div>
      <div v-else>
        <section v-if="!isTableLayout">
          <VideosGrid
            video-item-mode="list-reactions"
            :videos="flattenPagination(videos)"
            redirect-to="studio"
          />
        </section>
        <section v-else>
          <div class="your-content__videos__table">
            <VideosTable :videos="flattenPagination(videos)" redirect-to="studio" />
          </div>
        </section>
      </div>
    </section>
    <span v-if="isPageLoading">pending...</span>
    <span v-if="pageError">{{ pageError.message }}</span>
    <UploadVideoPopup v-model="showUploadPopup" @files-selected="onFileUpload" />
  </div>
</template>

<style scoped lang="scss">
@import '../../../styles/bootstrap/index.scss';

.your-content {
  padding: 2rem 1rem;
}

.your-content__header {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
}

.your-content__header__title {
  font-size: 1.25rem;
  font-weight: bold;
}

.your-content__header__btn {
  font-size: 0.75rem;
}

.your-content__videos {
  margin-top: 1.75rem;
  display: grid;
  gap: 1rem;
}

.your-content__videos__table {
  background-color: $secondary;
  border-radius: $border-radius-md;
  padding: 1.5rem;
}

@include media-breakpoint-up(md) {
  .your-content__header__title {
    font-size: 1.75rem;
  }

  .your-content__header__btn {
    font-size: 1rem;
  }
}
</style>
