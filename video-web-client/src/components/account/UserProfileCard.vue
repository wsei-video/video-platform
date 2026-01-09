<script setup lang="ts">
import { useGetAccountSettingsPage } from '@/application'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'

import ProfileBadge from '../ui/ProfileBadge.vue'

const { accountData } = useGetAccountSettingsPage()
</script>

<template>
  <div v-if="accountData" class="card">
    <h2>Your Account</h2>

    <div class="profile-avatar-section">
      <ProfileBadge
        class="mb-3"
        avatar-only
        :profile-image="''"
        profile-name=""
        :image-props="{ width: '120px' }"
      />
      <AppButton outline disabled class="btn-sm">Change picture</AppButton>
    </div>

    <div class="mb-3">
      <AppInput id="accountId" label="User ID" v-model="accountData.account.id" disabled />
    </div>
    <div class="mb-3">
      <AppInput id="email" label="Email Address" v-model="accountData.account.email" disabled />
    </div>

    <div class="mb-3">
      <AppInput id="name" label="Display Name" v-model="accountData.account.name" disabled />
    </div>

    <div class="mb-3">
      <label>Creation Date</label>
      <div class="text-muted small">{{ accountData.account.formattedCreationDate }}</div>
    </div>
    <AppButton class="align-self-start" variant="primary" disabled>Save changes</AppButton>
  </div>
</template>

<style scoped lang="scss">
@import '../../styles/bootstrap/index.scss';

.card {
  background-color: $secondary;
  border: 1px solid $accent;
  border-radius: $border-radius-md;
  padding: 1.5rem;
  box-shadow: 0 0.25rem 0.375rem -0.0625rem rgba(0, 0, 0, 0.3);

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

.profile-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}
</style>
