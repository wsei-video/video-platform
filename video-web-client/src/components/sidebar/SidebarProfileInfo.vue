<script setup lang="ts">
import { AppImage } from '@/components/ui'

defineProps<{
  profileImage: string
  profileName: string
}>()
</script>
<template>
  <div class="sidebar-profile-info">
    <AppImage alt="Profile picture" :src="profileImage" class="sidebar-profile-info-image" />
    <span>{{ profileName }}</span>
  </div>
</template>

<style lang="scss">
@import '../../styles/bootstrap/index.scss';

.sidebar-profile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: $white;
  font-weight: $font-weight-bold;
  font-size: $font-size-lg;
}

.sidebar-profile-info-image {
  max-width: 120px;
  aspect-ratio: 1;
  border-radius: 50%;
}
</style>
