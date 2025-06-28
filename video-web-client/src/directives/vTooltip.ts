import type { DirectiveBinding } from 'vue'
import { Tooltip } from 'bootstrap'

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
    const placement = binding.arg || 'bottom'
    el.setAttribute('data-bs-placement', placement)
    new Tooltip(el)
  },
  updated(el: HTMLElement, binding: DirectiveBinding<string>) {
    const placement = binding.arg || 'bottom'
    el.setAttribute('data-bs-placement', placement)
    new Tooltip(el)
  },
  beforeUnmount(el: HTMLElement) {
    Tooltip.getInstance(el)?.dispose()
  },
}
