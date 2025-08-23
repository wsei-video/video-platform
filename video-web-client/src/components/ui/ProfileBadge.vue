<script setup lang="ts">
import { computed } from 'vue'

import { AppImage } from '@/components/ui'

import { type AppImageProps } from '@/components/ui'

const {
  profileImage,
  profileName,
  avatarOnly = false,
  imageProps = {},
} = defineProps<{
  profileImage: string
  profileName: string
  avatarOnly?: boolean
  imageProps?: Omit<AppImageProps, 'src'>
}>()

const resolvedImageProps = computed(() => ({
  width: '2.5rem',
  aspectRatio: '1',
  borderRadius: '50%',
  ...imageProps,
}))
</script>
<template>
  <div class="profile-badge">
    <AppImage :src="profileImage" v-bind="resolvedImageProps" />
    <span v-if="!avatarOnly">{{ profileName }}</span>
  </div>
</template>
<style scoped lang="scss">
.profile-badge {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
}
</style>
