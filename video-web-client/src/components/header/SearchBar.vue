<script setup lang="ts">
import { breakpointsBootstrapV5, useBreakpoints } from '@vueuse/core'
import { nextTick, ref } from 'vue'

import { useSearchBar } from '@/application/useSearchBar'
import { AppIcon } from '@/components/ui'

const breakpoints = useBreakpoints(breakpointsBootstrapV5)
const isMobile = breakpoints.smaller('md')

const isActive = ref(false)
const searchBarRef = ref<HTMLElement | null>(null)
const { searchQuery, recentSearchesFiltered, search } = useSearchBar()

const activate = async () => {
  isActive.value = true
  await nextTick()
  const inputEl = searchBarRef.value?.querySelector('input')
  inputEl?.focus()
}

const submitSearch = () => {
  const inputEl = searchBarRef.value?.querySelector('input')
  search()
  isActive.value = false
  inputEl?.blur()
}

const cancelSeach = () => {
  const inputEl = searchBarRef.value?.querySelector('input')
  searchQuery.value = ''
  isActive.value = false
  inputEl?.blur()
}

const selectRecent = (term: string) => {
  searchQuery.value = term
  submitSearch()
}
</script>

<template>
  <div
    ref="searchBarRef"
    class="search-bar"
    :class="{ 'is-active': isActive, 'is-mobile': isMobile }"
  >
    <div v-if="isMobile && !isActive" class="search-trigger" @click="activate">
      <AppIcon name="search" />
    </div>

    <div v-else class="search-interface" @click="activate">
      <AppIcon
        v-if="isMobile"
        name="arrow_back"
        class="back-icon me-2"
        @click.stop="isActive = false"
      />

      <div class="input-wrapper">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search"
          class="form-control search-input"
          @keydown.enter="submitSearch"
          @keydown.esc="cancelSeach"
          v-click-outside="() => (isActive = false)"
        />
        <div class="search-icon-wrapper" @click="submitSearch">
          <AppIcon name="search" />
        </div>
      </div>

      <div v-if="isActive" class="recent-searches">
        <div class="recent-header">Recent searches</div>
        <ul class="recent-list">
          <li
            v-for="term in recentSearchesFiltered"
            :key="term"
            class="recent-item"
            @click.stop="selectRecent(term)"
          >
            <AppIcon name="history" class="history-icon" />
            <span class="term-text">{{ term }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../../styles/bootstrap/index.scss';

.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-trigger {
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $white;

  &:hover {
    opacity: 0.8;
  }
}

.search-bar.is-active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: $secondary;
  z-index: $zindex-searchbar;
}

.search-interface {
  width: 100%;
  margin: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100%;

  @include media-breakpoint-up(md) {
    max-width: 600px;
    margin: 0 auto;
  }
}

.back-icon {
  cursor: pointer;
  font-size: 1.5rem;
  color: $white;
}

.input-wrapper {
  position: relative;
  flex-grow: 1;
  display: flex;
  align-items: center;
  height: 100%;
  max-height: 40px;

  .search-input {
    padding-right: 5rem;
    background-color: $body-bg-dark;
  }

  .search-icon-wrapper {
    position: absolute;
    right: 0.25rem;
    top: 50%;
    transform: translateY(-50%);
    width: 2.5rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: $input-placeholder-color;
    border-radius: 0 $btn-border-radius $btn-border-radius 0;

    &:hover {
      color: $white;
    }
  }
}

.recent-searches {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  background-color: $secondary;
  border-radius: $border-radius-sm;
  padding: 0.5rem 0;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  z-index: $zindex-searchbar;
  border: 1px solid $accent;
  max-height: 300px;
  overflow-y: auto;

  .recent-header {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: $text-muted;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .recent-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .recent-item {
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    transition: background-color 0.15s;

    &:hover {
      background-color: lighten($secondary, 5%);
    }

    .history-icon {
      color: $text-muted;
      font-size: 1.25rem;
    }

    .term-text {
      color: $white;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
