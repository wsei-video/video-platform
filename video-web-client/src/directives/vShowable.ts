import type { DirectiveBinding } from 'vue'

/**
 * Add animated fade-in and fade-out behavior to the attached element.
 */
export default {
  mounted(el: HTMLElement, binding: DirectiveBinding<boolean>) {
    el.style.transition = 'opacity 0.15s ease-out'

    if (binding.value) {
      el.style.opacity = '1'
    } else {
      el.style.opacity = '0'
      el.style.display = 'none'
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding<boolean>) {
    const showElement = !!binding.value
    const wasElementShown = !!binding.oldValue
    if (showElement === wasElementShown) return

    if (showElement) {
      el.style.display = ''
      // Allow browser to register display change before changing opacity
      return requestAnimationFrame(() => (el.style.opacity = '1'))
    }

    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName !== 'opacity') return
      el.style.display = 'none'
      el.removeEventListener('transitionend', onTransitionEnd)
    }

    el.addEventListener('transitionend', onTransitionEnd)
    el.style.opacity = '0'
  },
}
