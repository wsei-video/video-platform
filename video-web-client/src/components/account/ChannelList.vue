<script setup lang="ts">
import { ref } from 'vue'

import { useGetAccountSettingsPage } from '@/application'
import { AppButton, AppIcon } from '@/components/ui/'
import type { Channel } from '@/domain/channel'

import AddUserModal from './AddUserModal.vue'
import ChannelCard from './ChannelCard.vue'
import EditChannelModal from './EditChannelModal.vue'

const { userChannels, selectedChannel, setSelectedChannel, deleteChannel } =
  useGetAccountSettingsPage()

const showChannelModal = ref(false)
const showAddUserModal = ref(false)
const modalChannel = ref<Channel | undefined>()

function openChannelEditModal(channel?: Channel) {
  modalChannel.value = channel
  showChannelModal.value = true
}

function openLinkChannelModal(channel: Channel) {
  modalChannel.value = channel
  showAddUserModal.value = true
}

defineEmits(['add-user'])
</script>
<template>
  <div class="card">
    <h2>
      Your Channels
      <AppButton variant="primary" class="btn-sm" @click="() => openChannelEditModal()"
        ><AppIcon name="add" /> New Channel</AppButton
      >
    </h2>

    <div v-if="userChannels.length > 0" class="channels-grid">
      <ChannelCard
        v-for="channel in userChannels"
        :selected="channel.id === selectedChannel?.id"
        :key="channel.id"
        :channel="channel"
        @select-channel="setSelectedChannel"
        @delete-channel="deleteChannel"
        @edit-channel="openChannelEditModal"
        @add-user="openLinkChannelModal"
      />
    </div>
    <div v-else class="">You have no channels assigned</div>
  </div>
  <EditChannelModal
    :show="showChannelModal"
    :channel="modalChannel"
    @close="showChannelModal = false"
  />
  <AddUserModal
    :show="showAddUserModal"
    :channel="modalChannel"
    @close="showAddUserModal = false"
  />
</template>
<style scoped lang="scss">
@import '@/styles/bootstrap/index.scss';

.card {
  background-color: $secondary;
  border: 1px solid $accent;
  border-radius: $border-radius-md;
  padding: 1.5rem;
  box-shadow: 0 0.25rem 0.375rem -0.0625rem rgba(0, 0, 0, 0.3);
  max-width: 800px;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid $accent;
    padding-bottom: 0.625rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.channels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17.5rem, 1fr));
  gap: 1rem;
}
</style>
