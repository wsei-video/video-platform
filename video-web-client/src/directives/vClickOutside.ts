import type { DirectiveBinding } from 'vue'

const clickHandler = Symbol()

type ClickOutsideElement = HTMLElement & {
  [clickHandler]?: (event: MouseEvent) => void
}

/**
 * Executes the provided function when the user clicks anywhere on the document
 * outside of the element that the directive is attached to.
 */
export default {
  mounted(el: ClickOutsideElement, binding: DirectiveBinding<() => void>) {
    if (el[clickHandler]) return

    const handleClick = (event: MouseEvent) => {
      if (
        el !== event.target &&
        event.target instanceof Node &&
        document.contains(event.target) &&
        !el.contains(event.target)
      )
        binding.value()
    }

    document.addEventListener('click', handleClick)
    el[clickHandler] = handleClick
  },
  beforeUnmount(el: ClickOutsideElement) {
    if (!el[clickHandler]) return
    document.removeEventListener('click', el[clickHandler])
    delete el[clickHandler]
  },
}
