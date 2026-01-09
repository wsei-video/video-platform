<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import WatchMeLogo from '@/assets/watch-me-logo.svg'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import type { AccountLoginCommand } from '@/domain/account'
import { getReason } from '@/domain/shared/error'
import { useAuthStore } from '@/store'

const authStore = useAuthStore()
const router = useRouter()

const tempLoginData = ref<AccountLoginCommand>({
  email: '',
  password: '',
})

async function login() {
  try {
    await authStore.handleLogin(tempLoginData.value)
    router.push({
      name: 'trending',
    })
  } catch (e) {
    console.log(e)
  }
}

function redirectToRegister() {
  router.push({
    name: 'register-page',
  })
}

const errorMessage = computed(() => {
  const reason = getReason(authStore.authError)
  if (reason && reason.name === 'InvalidCredentials') {
    return 'Invalid credentials'
  }
  return authStore.authError?.message
})
</script>

<template>
  <div class="login-container">
    <div class="login-content">
      <img :src="WatchMeLogo" width="250" alt="WatchMe logo" class="logo" />
      <div class="login-form-container card">
        <div id="login-form" action="">
          <h3 class="my-3">Sign in</h3>
          <div class="form-group">
            <label for="email">Email</label>
            <AppInput v-model="tempLoginData.email" type="email" id="email" class="form-control" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <AppInput
              v-model="tempLoginData.password"
              type="password"
              id="password"
              class="form-control"
            />
          </div>
          <div>
            <AppButton @click="login">Sign In</AppButton>
          </div>
          <div class="d-flex align-items-center">
            <hr class="flex-grow-1 my-0" />
            <span class="mx-2 text-muted lh-1">or if you dont have an account</span>
            <hr class="flex-grow-1 my-0" />
          </div>
          <div>
            <!-- we don't do that here :/ -->
            <!-- <img :src="LoginWithGoogle" alt="Login with Google" /> -->
            <AppButton outline @click="redirectToRegister">Register</AppButton>
          </div>
        </div>
      </div>
      <p v-if="authStore.isAuthPending">Loading...</p>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../styles/bootstrap/index.scss';

.login-container {
  position: relative;
  min-height: 100vh;
  background-image: url('../assets/login-page-background.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: $zindex-login-cover;
}

.login-content {
  z-index: $zindex-login-content;
  text-align: center;
  width: clamp(300px, 50vw, 400px);
  margin-bottom: 3rem;
}

.login-form-container {
  padding: 1.5rem;
  margin-top: 2rem;
  border: none;
  box-shadow: 3px 0px 10px black;
}

#login-form {
  text-align: center;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .form-group {
    text-align: left;
  }

  label {
    margin-bottom: 0.5rem;
  }
}
</style>
