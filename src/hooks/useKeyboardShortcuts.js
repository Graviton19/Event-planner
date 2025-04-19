import { useEffect } from 'react'

const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Don't trigger shortcuts when typing in form inputs
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.tagName === 'SELECT'
      ) {
        return
      }

      const shortcut = shortcuts.find(s => {
        const matchesKey = s.key === event.key
        const matchesCtrl = s.ctrl ? event.ctrlKey : !event.ctrlKey
        const matchesAlt = s.alt ? event.altKey : !event.altKey
        const matchesShift = s.shift ? event.shiftKey : !event.shiftKey
        
        return matchesKey && matchesCtrl && matchesAlt && matchesShift
      })

      if (shortcut) {
        event.preventDefault()
        shortcut.action()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

export default useKeyboardShortcuts