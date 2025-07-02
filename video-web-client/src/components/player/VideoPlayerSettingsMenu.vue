<script setup lang="ts">
import { shallowRef, watch, type DefineComponent } from 'vue'

import { useVideoPlayerStore } from '@/store'
import VideoPlayerMenuItem from './VideoPlayerMenuItem.vue'
import VideoPlayerSettingsPlaybackSpeedItem from './VideoPlayerSettingsPlaybackSpeedItem.vue'
import VideoPlayerSettingsPlaybackSpeedScreen from './VideoPlayerSettingsPlaybackSpeedScreen.vue'
import VideoPlayerSettingsQualityItem from './VideoPlayerSettingsQualityItem.vue'
import VideoPlayerSettingsQualityScreen from './VideoPlayerSettingsQualityScreen.vue'

type MenuScreen = { name: string; component: DefineComponent<{}, {}, any> }

const videoPlayerStore = useVideoPlayerStore()
const currentScreen = shallowRef<MenuScreen | null>(null)

const screens = {
  quality: { name: 'Quality', component: VideoPlayerSettingsQualityScreen },
  playbackSpeed: { name: 'Playback speed', component: VideoPlayerSettingsPlaybackSpeedScreen },
} as const satisfies Record<string, MenuScreen>

// Clear the previously selected screen after opening the menu again
watch(
  () => videoPlayerStore.isSettingsMenuShown,
  (isShown) => isShown && (currentScreen.value = null),
)
</script>

<template>
  <div
    v-click-outside="() => videoPlayerStore.setSettingsMenuShown(false)"
    v-showable="videoPlayerStore.isSettingsMenuShown"
    class="video-player-settings-menu"
  >
    <template v-if="currentScreen">
      <VideoPlayerMenuItem
        icon="chevron_backward"
        :label="currentScreen.name"
        @click="currentScreen = null"
      />
      <hr class="video-player-settings-menu-separator" />
      <component :is="currentScreen.component" />
    </template>

    <template v-else>
      <VideoPlayerSettingsQualityItem @click="currentScreen = screens.quality" />
      <VideoPlayerSettingsPlaybackSpeedItem @click="currentScreen = screens.playbackSpeed" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.video-player-settings-menu {
  position: absolute;
  overflow: hidden;
  border-radius: 12px;
  background: rgba(16, 16, 16, 0.8);
  border: 1px solid rgba(160, 160, 160, 0.2);
  color: #fff;
  right: 12px;
  bottom: 54px;
  min-width: 250px;
  padding: 0.5rem 0;
  font-size: 0.85rem;
}

.video-player-settings-menu-separator {
  opacity: 1;
  border-top: 1px solid rgba(160, 160, 160, 0.2);
  margin: 0.5rem 0;
}
</style>
