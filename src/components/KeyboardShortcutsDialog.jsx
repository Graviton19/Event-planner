import { useRef, useState } from 'react'
import useFocusTrap from '../hooks/useFocusTrap'

const KeyboardShortcutsDialog = () => {
  const dialogRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)

  useFocusTrap(dialogRef, isOpen)

  const openDialog = () => {
    setIsOpen(true)
    dialogRef.current?.showModal()
  }

  const closeDialog = () => {
    setIsOpen(false)
    dialogRef.current?.close()
  }

  return (
    <>
      <button
        aria-label="Show keyboard shortcuts"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg p-1"
        onClick={openDialog}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        className="p-6 rounded-lg shadow-xl backdrop:bg-gray-800/50 max-w-md w-full"
        aria-label="Keyboard shortcuts"
        onClose={() => setIsOpen(false)}
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          Keyboard Shortcuts
        </h2>

        <div className="border-t border-b py-4 mb-6">
          <ul className="space-y-3">
            <li className="flex items-center justify-between">
              <span className="text-gray-700">Next step</span>
              <kbd className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">→</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-gray-700">Previous step</span>
              <kbd className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">←</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-gray-700">Save changes</span>
              <kbd className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">Ctrl + S</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-gray-700">Close dialogs</span>
              <kbd className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">Esc</kbd>
            </li>
          </ul>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={closeDialog}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </dialog>
    </>
  )
}

export default KeyboardShortcutsDialog