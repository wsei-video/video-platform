<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppIcon from './components/ui/AppIcon.vue'

const variants = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark']
</script>

<template>
  <div class="container my-3">
    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <h3>Heading 3</h3>
    <h4>Heading 4</h4>
    <h5>Heading 5</h5>
    <h6>Heading 6</h6>

    <div v-for="(variant, index) in variants" class="pb-2" :key="variant">
      <AppButton :variant="variant">
        <AppIcon v-if="index % 2 === 0" name="home" />
        <span>Button {{ variant }}</span>
        <AppIcon v-if="index % 2 === 1" name="home" />
      </AppButton>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>Card header</h3>
      </div>
      <div class="card-body">Card content</div>
      <div class="card-footer">Card footer</div>
    </div>

    <form>
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">Email address</label>
        <input
          type="email"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
        />
        <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">Password</label>
        <input
          type="password"
          placeholder="password"
          class="form-control"
          id="exampleInputPassword1"
        />
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="exampleCheck1" />
        <label class="form-check-label" for="exampleCheck1">Check me out</label>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>

  <div class="container">
    <RouterView />
  </div>
</template>

<style scoped></style>
