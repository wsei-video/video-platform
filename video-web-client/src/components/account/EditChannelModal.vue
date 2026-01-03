<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { useGetAccountSettingsPage } from '@/application'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import type { Channel, ChannelUpdateCommand } from '@/domain/channel'
import { StringUtils } from '@/infrastructure/video-api/shared/utils'

export type ChannelModalActions = 'add' | 'edit'

const { saveChannelInfo, createChannel } = useGetAccountSettingsPage()

const props = defineProps<{
  show: boolean
  channel?: Channel
}>()

const emit = defineEmits(['close'])
const mode = computed(() => (props.channel ? 'Edit' : 'Add'))

const tmpChannel = ref<ChannelUpdateCommand>({
  id: '',
  name: '',
  slug: '',
})

async function handleSave() {
  console.log(props.channel)
  if (!props.channel) {
    await createChannel({
      name: tmpChannel.value.name || '',
      slug: tmpChannel.value.slug || '',
    })
  } else {
    await saveChannelInfo(tmpChannel.value)
  }
  emit('close')
}

watch(
  () => props.channel,
  () => {
    if (!props.channel) return
    tmpChannel.value = {
      id: props.channel.id,
      name: props.channel.name,
      slug: props.channel.slug,
    }
  },
)
</script>
<template>
  <transition name="nested">
    <div v-if="show" class="backdrop" @click.self="emit('close')">
      <div class="modal-window app-popup inner">
        <div class="modal-header">{{ StringUtils.capitalize(mode) }} Channel</div>
        <div class="mb-3">
          <AppInput id="c-name" label="Channel name" variant="dark" v-model="tmpChannel.name" />
        </div>
        <div class="mb-3">
          <AppInput
            id="c-slug"
            label="Slug (unique identifier)"
            variant="dark"
            v-model="tmpChannel.slug"
          />
        </div>

        <div class="modal-footer">
          <AppButton variant="secondary" @click="emit('close')">Cancel</AppButton>
          <AppButton variant="primary" @click="handleSave">Save</AppButton>
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
