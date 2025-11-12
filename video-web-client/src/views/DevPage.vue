<script setup lang="ts">
import { RouterView } from 'vue-router'

import { useGetRecommendedVideos, useGetVideo } from '@/application/queries/video'
import { VideoPlayer } from '@/components/player'
import {
  AnimatedPlaceholder,
  AppButton,
  AppIcon,
  AppInput,
  type ButtonVariant,
  UploadDropZone,
} from '@/components/ui'
import { VideoItem } from '@/components/video'

const variants: ButtonVariant[] = [
  'primary',
  'secondary',
  'success',
  'info',
  'warning',
  'danger',
  'light',
  'dark',
]

const { data: watchVideo, isPending: videoPending, error: videoError } = useGetVideo('1')
const { data: recommendedVideos, error: recommendedVideosError } = useGetRecommendedVideos('1')
</script>

<template>
  <div v-if="watchVideo" class="mb-3">
    <VideoPlayer :source="watchVideo.hlsUrl" />
  </div>
  <div v-if="videoError">video error: {{ videoError.message }}</div>
  <div v-if="videoPending">Pending...</div>
  <div v-if="recommendedVideos">
    <VideoItem
      v-for="video in recommendedVideos"
      :key="video.id"
      :video-data="video"
      mode="auto"
      :redirect-to="`/${video.id}`"
    />
  </div>
  <div v-if="recommendedVideosError">
    recommendedVideos error: {{ recommendedVideosError.message }}
  </div>
  <UploadDropZone
    class="p-2 my-2"
    @file-cahnge="(files: File[]) => console.log(files)"
    :multiple="false"
    :data-types="['video/mp4']"
    :prevent-default-for-unhandled="true"
    :file-list="true"
  />
  <h1>Heading 1</h1>
  <h2>Heading 2</h2>
  <h3>Heading 3</h3>
  <h4>Heading 4</h4>
  <h5>Heading 5</h5>
  <h6>Heading 6</h6>
  <div v-for="(variant, index) in variants" class="pb-2" :key="variant">
    <AppButton :variant="variant">
      <AppIcon v-if="index % 2 === 0" name="home" />
      <span>Button {{ variant }}</span>
      <AppIcon v-if="index % 2 === 1" name="menu" />
    </AppButton>
  </div>
  <div class="card">
    <div class="card-header">
      <h3>Card header</h3>
    </div>
    <div class="card-body">Card content</div>
    <div class="card-footer">Card footer</div>
  </div>
  <form>
    <div class="mb-3">
      <label for="exampleInputEmail1" class="form-label">Email address</label>
      <input
        type="email"
        class="form-control"
        id="exampleInputEmail1"
        aria-describedby="emailHelp"
      />
      <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
      <AppInput
        id="exampleInputEmail2"
        type="text"
        label="Card number"
        :feedback="{ enabled: true, type: 'error', message: 'broken ;(' }"
      />
    </div>
    <div class="mb-3">
      <h3>Animated placeholder</h3>
      <AnimatedPlaceholder width="300px" height="200px" border-radius="20px" />
    </div>
    <div class="mb-3">
      <label for="exampleInputPassword1" class="form-label">Password</label>
      <input
        type="password"
        placeholder="password"
        class="form-control"
        id="exampleInputPassword1"
      />
    </div>
    <div class="mb-3">
      <label for="exampleInputPassword1" class="form-label">Provide feedback</label>
      <textarea name="test" id="test" class="form-control"></textarea>
    </div>
    <div class="mb-3 form-check">
      <input type="checkbox" class="form-check-input" id="exampleCheck1" />
      <label class="form-check-label" for="exampleCheck1">Check me out</label>
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
  <div class="container">
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
#app-content {
  width: 100%;
}
</style>
