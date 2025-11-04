<script setup lang="ts">
import type { Video } from '@/services/api'

import VideoItem from '@/components/video/VideoItem.vue'

const { videos } = defineProps<{ videos: Video[] }>()
</script>
<template>
  <VideoItem v-for="video in videos" mode="tile" :key="video.id" :video-data="video" />
</template>

<style scoped></style>
