import type { DirectiveBinding } from 'vue'

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding<number>) {
    el.style.display = '-webkit-box'
    el.style.webkitLineClamp = binding.value.toString()
    el.style.overflow = 'hidden'
    el.style.maxHeight = `calc(${binding.value} * 1.5em)`
    el.style.textOverflow = 'elipsis'
    el.style.setProperty('-webkit-box-orient', 'vertical')
  },
}
