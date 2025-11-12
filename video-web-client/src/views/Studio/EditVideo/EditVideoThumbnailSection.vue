<script setup lang="ts">
import { AppIcon } from '@/components/ui'

export type ThumbnailApproach = 'uploaded' | 'generated'
const selected = defineModel<ThumbnailApproach>()
</script>
<template>
  <section class="edit-video__section">
    <h3 class="edit-video__section-title">Thumbnail</h3>
    <p class="edit-video__section-subtitle">
      Set a thumbnail that stands out and draws viewers' attention.
      <a href="#" class="edit-video__link">Learn more</a>
    </p>
    <div class="edit-video__thumbnails">
      <div
        class="edit-video__thumbnail-option"
        :class="{ selected: selected == 'uploaded' }"
        @click="() => (selected = 'uploaded')"
      >
        <AppIcon name="add_photo_alternate" />
        <span>Upload file</span>
      </div>
      <div
        class="edit-video__thumbnail-option"
        :class="{ selected: selected == 'generated' }"
        @click="() => (selected = 'generated')"
      >
        <AppIcon name="smart_toy" />
        <span>Auto generated</span>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@import '../../../styles/bootstrap/index.scss';

.edit-video__section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.edit-video__section-title {
  font-size: 1rem;
  font-weight: $font-weight-semibold;
  margin: 0;
}
.edit-video__thumbnails {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.edit-video__thumbnail-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  aspect-ratio: 16/9;
  border: 1px dashed $accent;
  border-radius: $border-radius-md;
  background-color: $accent;
  cursor: pointer;
  font-size: 0.75rem;
  transition: border-color 0.2s;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: $primary;
  }
}

.selected {
  border: 2px solid $primary;
  border-style: solid;
}
</style>
