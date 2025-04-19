import { useCallback } from 'react'

const useMenuKeyboardNavigation = (containerRef) => {
  const handleKeyDown = useCallback((event) => {
    const container = containerRef.current
    if (!container) return

    const items = Array.from(container.querySelectorAll('[role="menuitem"]'))
    const currentIndex = items.indexOf(document.activeElement)
    const cols = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1

    let nextIndex = -1

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = currentIndex + 1
        break
      case 'ArrowLeft':
        nextIndex = currentIndex - 1
        break
      case 'ArrowDown':
        nextIndex = currentIndex + cols
        break
      case 'ArrowUp':
        nextIndex = currentIndex - cols
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = items.length - 1
        break
      default:
        return
    }

    if (nextIndex >= 0 && nextIndex < items.length) {
      event.preventDefault()
      items[nextIndex].focus()
    }
  }, [containerRef])

  return handleKeyDown
}

export default useMenuKeyboardNavigation