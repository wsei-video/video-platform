import type { Directive, DirectiveBinding } from 'vue'

interface HTMLElementWithGuard extends HTMLElement {
  __clickGuardHandler?: (e: Event) => void
  __clickGuardValue?: boolean
}

const clickGuard: Directive = {
  mounted(el: HTMLElementWithGuard, binding: DirectiveBinding<boolean>) {
    el.__clickGuardValue = binding.value

    const handler = (e: Event) => {
      if (el.__clickGuardValue) {
        e.stopPropagation()
        e.stopImmediatePropagation()
        e.preventDefault()
        console.log('Click guard: blocked')
      }
    }

    el.__clickGuardHandler = handler
    el.addEventListener('click', handler, { capture: true })
  },

  updated(el: HTMLElementWithGuard, binding: DirectiveBinding<boolean>) {
    el.__clickGuardValue = binding.value
  },

  unmounted(el: HTMLElementWithGuard) {
    if (el.__clickGuardHandler) {
      el.removeEventListener('click', el.__clickGuardHandler, { capture: true })
      delete el.__clickGuardHandler
      delete el.__clickGuardValue
    }
  },
}

export default clickGuard
