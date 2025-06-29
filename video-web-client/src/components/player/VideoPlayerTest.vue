<script setup lang="ts">
import { ref } from 'vue'

import VideoPlayer from './VideoPlayer.vue'

type VideoTestStream = {
  title: string
  source: string
}

const videoTestStreams: VideoTestStream[] = [
  {
    title: 'Big Buck Bunny - adaptive qualities',
    source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  },
  {
    title: 'Big Buck Bunny - 480p only',
    source: 'https://test-streams.mux.dev/x36xhzz/url_6/193039199_mp4_h264_aac_hq_7.m3u8',
  },
  {
    title: 'ARTE China, ABR',
    source: 'https://test-streams.mux.dev/test_001/stream.m3u8',
  },
  {
    title: 'Tears of Steel, HLS with IMSC Captions',
    source: 'https://test-streams.mux.dev/tos_ismc/main.m3u8',
  },
]

const selectedStream = ref(videoTestStreams[0])
</script>

<template>
  <div>
    <select class="form-select mb-3" v-model="selectedStream">
      <option v-for="stream in videoTestStreams" :key="stream.source" :value="stream">
        {{ stream.title }}
      </option>
    </select>

    <div>
      <h3>{{ selectedStream.title }}</h3>
      <VideoPlayer :source="selectedStream.source" />
    </div>
  </div>
</template>
