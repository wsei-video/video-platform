<script setup lang="ts">
import { ref } from 'vue'

import { useGetAccountSettingsPage } from '@/application'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import type { Channel } from '@/domain/channel'

const props = defineProps<{
  show: boolean
  channel?: Channel
}>()

const { linkChannelToAccount } = useGetAccountSettingsPage()
const userId = ref('')

const emit = defineEmits(['close'])

async function handleAdd() {
  console.log(props.channel)
  await linkChannelToAccount({
    accountId: userId.value,
    id: props.channel?.id || '',
  })

  emit('close')
}
</script>
<template>
  <transition name="nested">
    <div v-if="show && channel" class="backdrop" @click.self="emit('close')">
      <div class="modal-window app-popup inner">
        <div class="modal-header">Add User to {{ channel.name }}</div>
        <p style="color: #aaa; margin-bottom: 0.9375rem; font-size: 0.9rem">
          Enter the account ID of the user you want to add to the channel
          <strong>{{ props.channel?.name }}</strong
          >.
        </p>
        <AppInput
          id="u-id"
          label="Account ID"
          variant="dark"
          placeholder="e.g., e4f1-..."
          v-model="userId"
        />

        <div class="modal-footer">
          <AppButton variant="secondary" @click="emit('close')"> Cancel </AppButton>
          <AppButton variant="primary" @click="handleAdd">Add</AppButton>
        </div>
      </div>
    </div>
  </transition>
</template>
<style scoped lang="scss">
@import '@/styles/bootstrap/index.scss';

.modal-window {
  background-color: $secondary;
  border: 1px solid $accent;
  border-radius: $border-radius-md;
  width: 100%;
  max-width: 28.125rem;
  padding: 1.5rem;
  box-shadow: 0 1.25rem 1.5625rem -0.3125rem rgba(0, 0, 0, 0.5);
}

.modal-header {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
}

.modal-footer {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.625rem;
}
</style>
