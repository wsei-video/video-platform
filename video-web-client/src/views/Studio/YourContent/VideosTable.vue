<script setup lang="ts">
import type { Video } from '@/services/api'
import { VideoUtils, StringUtils } from '@/utils'
import { useVideoRedirect, type VideoRedirect } from '@/composables'

import { AppImage } from '@/components/ui'

defineProps<{
  videos: Video[]
  redirectTo: VideoRedirect
}>()
</script>
<template>
  <table class="videos-table">
    <tr>
      <th>Video</th>
      <th></th>
      <th>Duration</th>
      <th>Uploaded</th>
      <th>Visibility</th>
      <th>Views</th>
    </tr>
    <RouterLink
      v-for="video in videos"
      :key="video.id"
      :to="useVideoRedirect(redirectTo, video)"
      custom
      v-slot="{ navigate, href }"
    >
      <tr :href="href" @click="navigate">
        <td>
          <AppImage class="videos-table__thumbnail" :src="video.thumbnail" :aspect-ratio="16 / 9" />
        </td>
        <td class="videos-table__title">
          <p v-tooltip:top="video.title" v-max-lines="3">{{ video.title }}</p>
        </td>
        <td>{{ VideoUtils.formatDuration(video.duration) }}</td>
        <td>{{ VideoUtils.formatDate(video.uploadedDate) }}</td>
        <td>{{ StringUtils.Capitalize(video.visibility) }}</td>
        <td>{{ VideoUtils.formatCount(video.views) }}</td>
      </tr>
    </RouterLink>
  </table>
</template>

<style scoped lang="scss">
@import '@/styles/bootstrap/index.scss';

.videos-table {
  font-weight: 500;
  font-size: 0.875rem;

  border-collapse: collapse;

  tr :not(:first-child) {
    cursor: pointer;
  }

  th,
  td {
    padding: 0.75rem;
    vertical-align: top;
  }
  th:first-child,
  td:first-child {
    padding-left: 0;
  }

  th:last-child,
  td:last-child {
    padding-right: 0;
  }

  th {
    color: $text-muted;
    font-size: 0.75rem;
  }
  td {
    border-top: 1px solid $accent;
  }

  // Thumbnail
  th:nth-child(1) {
    min-width: 140px;
    width: 170px;
  }

  // Title
  th:nth-child(2) {
    width: 35%;
  }

  // Duration
  th:nth-child(3) {
    width: 10%;
  }

  // Uploaded
  th:nth-child(4) {
    width: 15%;
  }

  // Visibility
  th:nth-child(5) {
    width: 8%;
  }

  // Views
  th:nth-child(6) {
    width: auto;
  }
}

.videos-table__thumbnail {
  border-radius: $border-radius-md;
}
</style>
