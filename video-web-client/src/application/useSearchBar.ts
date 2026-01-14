import { useLocalStorage } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

export function useSearchBar(maxRememberedSearches: number = 10) {
  const searchPhrases = useLocalStorage<string[]>('recent-search', ref([]))
  const searchQuery = ref('')
  const router = useRouter()

  function search() {
    if (!searchQuery.value) return

    if (!searchPhrases.value.find((p) => p == searchQuery.value))
      searchPhrases.value.push(searchQuery.value)

    if (searchPhrases.value.length > maxRememberedSearches) searchPhrases.value.shift()
    router.push({ name: 'search', query: { search: searchQuery.value } })
  }

  const recentSearchesFiltered = computed(() =>
    searchPhrases.value
      .filter((s) => s.toLowerCase().includes(searchQuery.value.toLowerCase()))
      .reverse(),
  )

  return {
    searchQuery,
    recentSearchesFiltered,
    search,
  }
}
