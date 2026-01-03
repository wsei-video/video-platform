<script setup lang="ts">
import { AppButton, AppIcon } from '@/components/ui/'
import type { Channel } from '@/domain/channel'

defineProps<{
  channel: Channel
  selected: boolean
}>()

const emit = defineEmits<{
  'edit-channel': [channel: Channel]
  'select-channel': [channelId: string]
  'delete-channel': [channelId: string]
  'add-user': [channel: Channel]
}>()
</script>
<template>
  <div class="channel-card" :class="{ active: selected }">
    <div class="channel-header">
      <div>
        <div class="channel-name">{{ channel.name }}</div>
        <span class="channel-slug">@{{ channel.slug }}</span>
      </div>
      <span v-if="selected" class="active-badge">Current</span>
    </div>

    <div class="channel-meta">Created: {{ channel.formattedCreationDate }}</div>

    <div class="channel-actions">
      <AppButton v-if="selected" outline class="btn-sm" @click="emit('edit-channel', channel)">
        Edit
      </AppButton>

      <AppButton
        v-if="!selected"
        variant="primary"
        class="btn-sm"
        @click="emit('select-channel', channel.id)"
      >
        Select
      </AppButton>
      <AppButton v-if="!selected" outline class="btn-sm" @click="emit('edit-channel', channel)">
        Edit
      </AppButton>
      <AppButton
        variant="secondary"
        class="btn-sm"
        title="Add user"
        @click="emit('add-user', channel)"
      >
        <AppIcon class="fs-5" name="person_add" />
      </AppButton>
      <AppButton
        @click="emit('delete-channel', channel.id)"
        variant="danger"
        class="btn-sm"
        title="Delete channel"
      >
        <AppIcon class="fs-5" name="delete" />
      </AppButton>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import '@/styles/bootstrap/index.scss';

.channel-card {
  background-color: #252525;
  border: 1px solid $accent;
  border-radius: $border-radius-md;
  padding: 1rem;
  position: relative;
  transition:
    transform 0.2s,
    border-color 0.2s;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    border-color: #555;
    transform: translateY(-0.125rem);
  }

  &.active {
    border-color: $success;
    background-color: rgba(16, 185, 129, 0.05);
  }
}

.channel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.625rem;
}

.channel-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
}

.channel-slug {
  font-size: 0.75rem;
  background-color: #333;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  color: #ccc;
  font-family: monospace;
}

.active-badge {
  background-color: $success;
  color: white;
  font-size: 0.7rem;
  padding: 0.125rem 0.5rem;
  border-radius: 0.75rem;
  text-transform: uppercase;
  font-weight: bold;
}

.channel-meta {
  font-size: 0.8rem;
  color: $text-muted;
  margin-top: auto;
  margin-bottom: 0.75rem;
  padding-top: 0.625rem;
}

.channel-actions {
  border-top: 1px solid #333;
  padding-top: 0.75rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>
