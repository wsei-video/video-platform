<script setup lang="ts">
import WatchMeLogo from '@/assets/watch-me-logo.svg'
import LoginWithGoogle from '@/assets/login-with-google-button.svg'
</script>

<template>
  <div class="login-container">
    <div class="login-content">
      <img :src="WatchMeLogo" width="250" alt="WatchMe logo" class="logo" />
      <div class="login-form-container card">
        <form id="login-form" action="">
          <h3 class="my-3">Sign in</h3>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" class="form-control" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" class="form-control" />
          </div>
          <div>
            <button type="submit" class="btn btn-primary">Sign In</button>
          </div>
          <div class="d-flex align-items-center">
            <hr class="flex-grow-1 my-0" />
            <span class="mx-2 text-muted lh-1">or</span>
            <hr class="flex-grow-1 my-0" />
          </div>
          <div>
            <img :src="LoginWithGoogle" alt="Login with Google" />
          </div>
        </form>
      </div>
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
