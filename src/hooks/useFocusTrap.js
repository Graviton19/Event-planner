import { useEffect } from 'react'

const useFocusTrap = (dialogRef, isOpen) => {
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return

    const dialog = dialogRef.current
    const focusableElements = dialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstFocusable = focusableElements[0]
    const lastFocusable = focusableElements[focusableElements.length - 1]

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault()
          lastFocusable.focus()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault()
          firstFocusable.focus()
        }
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        dialog.close()
      }
    }

    dialog.addEventListener('keydown', handleKeyDown)
    dialog.addEventListener('keydown', handleEscape)

    // Focus first element on open
    firstFocusable.focus()

    return () => {
      dialog.removeEventListener('keydown', handleKeyDown)
      dialog.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, dialogRef])
}

export default useFocusTrap