import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, watch } from 'vue'

import {
  useCreateChannel,
  useDeleteChannel,
  useLinkChannelToAccount,
  useUpdateChannel,
} from '@/application/commands/channel'
import { useGetUserChannels } from '@/application/queries/channel/useGetUserChannels'

export const useChannelStore = defineStore('channel', () => {
  const {
    data,
    isLoading: isFetchingChannels,
    error: fetchChannelsError,
    refetch,
  } = useGetUserChannels()

  const _selectedChannelId = useStorage<string | null>('selected-channel-id', null)
  const userChannels = computed(() => data.value?.pages.flatMap((page) => page.items) ?? [])

  const _isSelectedChannelValid = computed(() =>
    userChannels.value.some((c) => c.id === _selectedChannelId.value),
  )
  const selectedChannelId = computed(() => {
    if (!userChannels.value.length) return null
    return _isSelectedChannelValid.value ? _selectedChannelId.value : null
  })
  function setSelectedChannel(channelId: string | null) {
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

  const createChannelMutation = useCreateChannel()
  const updateChannelMutation = useUpdateChannel()
  const deleteChannelMutation = useDeleteChannel()
  const linkChannelToAccountMutation = useLinkChannelToAccount()

  const isMutating = computed(
    () =>
      createChannelMutation.isPending.value ||
      updateChannelMutation.isPending.value ||
      deleteChannelMutation.isPending.value ||
      linkChannelToAccountMutation.isPending.value,
  )

  const mutationError = computed(
    () =>
      createChannelMutation.error.value ||
      updateChannelMutation.error.value ||
      deleteChannelMutation.error.value ||
      linkChannelToAccountMutation.error.value,
  )

  return {
    userChannels,
    selectedChannelId,
    setSelectedChannel,
    getSelectedChannel,
    refetchUserChannels: refetch,

    isFetchingChannels,
    fetchChannelsError,

    isMutating,
    mutationError,

    updateChannel: updateChannelMutation.mutateAsync,
    createChannel: createChannelMutation.mutateAsync,
    deleteChannel: deleteChannelMutation.mutateAsync,
    linkChannelToAccount: linkChannelToAccountMutation.mutateAsync,
  }
})
