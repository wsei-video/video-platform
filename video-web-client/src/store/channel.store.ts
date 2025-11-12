import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, watch } from 'vue'

import { useGetUserChannels } from '@/application/queries/channel/useGetUserChannels'

export const useChannelStore = defineStore('channel', () => {
  const { data, isPending, error } = useGetUserChannels()

  const _selectedChannelId = useStorage<string | null>('selected-channel-id', null)
  const userChannels = computed(() => data.value?.pages.flatMap((page) => page.items) ?? [])

  const _isSelectedChannelValid = computed(() =>
    userChannels.value.some((c) => c.id === _selectedChannelId.value),
  )
  const selectedChannelId = computed(() => {
    if (!userChannels.value.length) return null
    return _isSelectedChannelValid.value ? _selectedChannelId.value : null
  })
  function setSelectedChannel(channelId: string) {
    _selectedChannelId.value = channelId
  }
  const getSelectedChannel = computed(() => {
    if (!_isSelectedChannelValid.value) return null
    return userChannels.value.find((c) => c.id === _selectedChannelId.value)
  })

  watch(
    userChannels,
    (channels) => {
      if (channels.length > 0 && (!_selectedChannelId.value || !_isSelectedChannelValid.value)) {
        _selectedChannelId.value = channels[0].id
      }
    },
    { immediate: true },
  )

  return {
    userChannels,
    selectedChannelId,
    setSelectedChannel,
    getSelectedChannel,
    isLoading: isPending,
    error,
  }
})
