import { Tooltip } from 'bootstrap'
import type { DirectiveBinding } from 'vue'

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
    const placement = binding.arg || 'bottom'
    el.setAttribute('data-bs-placement', placement)
    if (binding.value) {
      el.setAttribute('data-bs-title', binding.value)
    }
    new Tooltip(el)
  },
  updated(el: HTMLElement, binding: DirectiveBinding<string>) {
    const existingTooltip = Tooltip.getInstance(el)
    const wasTooltipShown = existingTooltip._isShown()
    if (existingTooltip) {
      existingTooltip.dispose()
    }
    const placement = binding.arg || 'bottom'
    console.log('Tooltip:', binding)
    el.setAttribute('data-bs-placement', placement)
    if (binding.value) {
      el.setAttribute('data-bs-title', binding.value)
    }
    const tooltip = new Tooltip(el)
    if (wasTooltipShown) tooltip.show()
  },
  beforeUnmount(el: HTMLElement) {
    Tooltip.getInstance(el)?.dispose()
  },
}
