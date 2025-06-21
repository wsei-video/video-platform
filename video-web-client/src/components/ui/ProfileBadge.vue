<script setup lang="ts">
import AppImage from '../ui/AppImage.vue'

const {
  profileImage,
  profileName,
  avatarOnly = false,
} = defineProps<{
  profileImage: string
  profileName: string
  avatarOnly?: boolean
}>()
</script>
<template>
  <div class="profile-badge">
    <AppImage :src="profileImage" class="badge-img" />
    <span v-if="!avatarOnly" class="fw-semibold">{{ profileName }}</span>
  </div>
</template>
<style scoped lang="scss">
.profile-badge {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}
.badge-img {
  aspect-ratio: 1;
  width: 2.5rem;
  border-radius: 50%;
}
</style>
