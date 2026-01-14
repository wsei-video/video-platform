import { computed, ref } from 'vue'

import type {
  ChannelCreateCommand,
  ChannelLinkCommand,
  ChannelUpdateCommand,
} from '@/domain/channel'
import { DomainError, UnexpectedError } from '@/domain/shared/error'
import { useAuthStore, useChannelStore } from '@/store'

import { useErrorNotifier } from './useErrorNotifier'

export function useGetAccountSettingsPage() {
  const authStore = useAuthStore()
  const channelStore = useChannelStore()

  const saveError = ref<Error>()

  const isLoading = computed(
    () => authStore.isAuthPending || channelStore.isFetchingChannels || channelStore.isMutating,
  )
  const error = computed(
    () =>
      authStore.authError ||
      channelStore.fetchChannelsError ||
      channelStore.mutationError ||
      saveError.value,
  )
  useErrorNotifier(error)

  async function saveChannelInfo(c: ChannelUpdateCommand) {
    saveError.value = undefined
    try {
      channelStore.getSelectedChannel?.validateUpdate(c)
      return await channelStore.updateChannel(c)
    } catch (e: unknown) {
      if (e instanceof DomainError) {
        saveError.value = e
      } else {
        saveError.value = new UnexpectedError('Save video')
      }
    } finally {
      channelStore.refetchUserChannels()
    }
  }

  async function createChannel(c: ChannelCreateCommand) {
    saveError.value = undefined
    try {
      return await channelStore.createChannel(c)
    } catch (e) {
      if (e instanceof DomainError) {
        saveError.value = e
      } else {
        saveError.value = new UnexpectedError('Save video')
      }
    } finally {
      channelStore.refetchUserChannels()
    }
  }

  async function deleteChannel(channelId: string) {
    saveError.value = undefined
    try {
      return await channelStore.deleteChannel(channelId)
    } catch (e) {
      if (e instanceof DomainError) {
        saveError.value = e
      } else {
        saveError.value = new UnexpectedError('Save video')
      }
    } finally {
      channelStore.refetchUserChannels()
    }
  }

  async function linkChannelToAccount(c: ChannelLinkCommand) {
    saveError.value = undefined
    try {
      return await channelStore.linkChannelToAccount(c)
    } catch (e) {
      if (e instanceof DomainError) {
        saveError.value = e
      } else {
        saveError.value = new UnexpectedError('Save video')
      }
    } finally {
      channelStore.refetchUserChannels()
    }
  }

  return {
    isLoading,
    error,

    accountData: computed(() => authStore.currentAuth),
    userChannels: computed(() => channelStore.userChannels),

    selectedChannel: computed(() => channelStore.getSelectedChannel),
    setSelectedChannel: channelStore.setSelectedChannel,

    saveChannelInfo,
    createChannel,
    deleteChannel,
    linkChannelToAccount,

    refetchChannels: channelStore.refetchUserChannels,
  }
}
