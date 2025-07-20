<script setup lang="ts">
import { RouterView } from 'vue-router'
import { AppButton, AppInput, AppIcon, type ButtonVariant } from '@/components/ui'
import { VideoCard, VideoListItem, type VideoItem } from '@/components/video'
import { VideoPlayerTest } from '@/components/player'

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

const testVideo: VideoItem = {
  creator: {
    profileImage: 'https://picsum.photos/200',
    profileName: 'Tomek Smialek',
  },
  thumbnail: 'https://picsum.photos/300',
  title: 'Lorem ipsum dolor sit amet, conse ctetur adipiscing elit. ',
  description:
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  uploadDate: new Date('2025-06-21'),
  views: 1400,
  duration: 1520,
}
</script>

<template>
  <div class="mb-3">
    <VideoPlayerTest />
  </div>
  <VideoListItem v-for="video in [1, 2, 3]" :key="video" :video-data="testVideo" />
  <VideoCard v-for="video in [1, 2, 3]" :key="video" :video-data="testVideo" />
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
