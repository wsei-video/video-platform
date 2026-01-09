export { default as DropdownContent } from './DropdownContent.vue'
export { default as DropdownItem } from './DropdownItem.vue'
export { default as DropdownLabel } from './DropdownLabel.vue'
export { default as DropdownMenu } from './DropdownMenu.vue'
export { default as DropdownSeparator } from './DropdownSeparator.vue'
export { default as DropdownTrigger } from './DropdownTrigger.vue'

import type { InjectionKey, Ref } from 'vue'

export interface DropdownContext {
  isOpen: Ref<boolean>
  toggle: () => void
  close: () => void
}

export const DropdownKey: InjectionKey<DropdownContext> = Symbol('DropdownContext')
