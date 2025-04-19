import { useState, useEffect, useCallback, useRef } from 'react'
import Calendar from './components/Calendar/Calendar'
import EventForm from './components/EventForm/EventForm'
import Preview from './components/Preview/Preview'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import KeyboardShortcutsDialog from './components/KeyboardShortcutsDialog'
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts'
import './App.css'

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedDates, setSelectedDates] = useState(new Map())
  const [activeDate, setActiveDate] = useState(null)
  const autoSaveRef = useRef(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  const steps = [
    { id: 1, name: 'Select Dates', description: 'Choose event dates' },
    { id: 2, name: 'Add Events', description: 'Add event details and menu' },
    { id: 3, name: 'Review', description: 'Review and download' }
  ]

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'ArrowRight',
      action: () => currentStep < 2 && goToStep(currentStep + 1)
    },
    {
      key: 'ArrowLeft',
      action: () => currentStep > 0 && goToStep(currentStep - 1)
    },
    {
      key: 's',
      ctrl: true,
      action: () => {
        saveToLocalStorage()
        // Show save feedback
        const toast = document.getElementById('save-toast')
        if (toast) {
          toast.classList.remove('hidden')
          setTimeout(() => toast.classList.add('hidden'), 2000)
        }
      }
    }
  ])

  const saveToLocalStorage = useCallback(() => {
    try {
      const dataToSave = Array.from(selectedDates.entries())
      const serializedData = JSON.stringify(dataToSave)
      
      // Test serialization/deserialization before saving
      JSON.parse(serializedData)
      
      localStorage.setItem('selectedDates', serializedData)
      localStorage.setItem('currentStep', String(currentStep))
      if (activeDate) {
        localStorage.setItem('activeDate', activeDate)
      }
      
      setHasUnsavedChanges(false)
    } catch (e) {
      console.error('Error saving state:', e)
      // Attempt recovery by saving only valid dates
      try {
        const validDates = new Map()
        selectedDates.forEach((events, date) => {
          try {
            const validEvents = events.filter(event => {
              // Validate each event object
              return event && 
                typeof event === 'object' && 
                typeof event.name === 'string' &&
                typeof event.time === 'string'
            })
            if (validEvents.length > 0) {
              validDates.set(date, validEvents)
            }
          } catch (eventError) {
            console.error('Error validating events for date:', date, eventError)
          }
        })
        localStorage.setItem('selectedDates', JSON.stringify(Array.from(validDates.entries())))
      } catch (recoveryError) {
        console.error('Recovery failed:', recoveryError)
      }
    }
  }, [selectedDates, currentStep, activeDate])

  useEffect(() => {
    if (hasUnsavedChanges) {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current)
      }
      autoSaveRef.current = setTimeout(saveToLocalStorage, 1000)
    }
    
    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current)
        // Save any pending changes on unmount
        if (hasUnsavedChanges) {
          saveToLocalStorage()
        }
      }
    }
  }, [hasUnsavedChanges, saveToLocalStorage])

  useEffect(() => {
    setHasUnsavedChanges(true)
  }, [selectedDates])

  useEffect(() => {
    try {
      const savedDatesStr = localStorage.getItem('selectedDates')
      const savedStepStr = localStorage.getItem('currentStep')
      const savedActiveDate = localStorage.getItem('activeDate')
      
      if (savedDatesStr) {
        const parsedDates = JSON.parse(savedDatesStr)
        // Validate the structure of saved dates
        if (Array.isArray(parsedDates)) {
          const validatedDates = new Map(
            parsedDates.filter(([date, events]) => {
              return (
                date && 
                typeof date === 'string' && 
                Array.isArray(events) &&
                events.every(event => 
                  event && 
                  typeof event === 'object' &&
                  typeof event.name === 'string' &&
                  typeof event.time === 'string'
                )
              )
            })
          )
          setSelectedDates(validatedDates)
        }
      }
      
      if (savedStepStr) {
        const step = Number(savedStepStr)
        if (!isNaN(step) && step >= 0 && step <= 2) {
          setCurrentStep(step)
        }
      }
      
      if (savedActiveDate) {
        setActiveDate(savedActiveDate)
      }
    } catch (e) {
      console.error('Error loading saved state:', e)
      // Clear potentially corrupted data
      localStorage.removeItem('selectedDates')
      localStorage.removeItem('currentStep')
      localStorage.removeItem('activeDate')
    }
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const handleDateSelect = (dateString) => {
    const newDates = new Map(selectedDates)
    if (newDates.has(dateString)) {
      newDates.delete(dateString)
    } else {
      newDates.set(dateString, [])
    }
    setSelectedDates(newDates)
    setActiveDate(dateString)
  }

  const handleEventsUpdate = (dateString, events) => {
    const newDates = new Map(selectedDates)
    newDates.set(dateString, events)
    setSelectedDates(newDates)
  }

  const goToStep = (stepIndex) => {
    if (stepIndex === 1 && currentStep === 0) {
      // Check if dates are selected
      if (selectedDates.size === 0) {
        alert('Please select at least one date before proceeding')
        return
      }
    }

    if (stepIndex === 2 && currentStep === 1) {
      // Check if events are added
      let hasEvents = false
      selectedDates.forEach(events => {
        if (events.length > 0) hasEvents = true
      })
      if (!hasEvents) {
        alert('Please add at least one event before proceeding to review')
        return
      }
    }

    setCurrentStep(stepIndex)
  }

  const canNavigateToStep = (stepIndex) => {
    if (stepIndex === 1 && currentStep === 0) {
      return selectedDates.size > 0
    }
    if (stepIndex === 2 && currentStep === 1) {
      let hasEvents = false
      selectedDates.forEach(events => {
        if (events.length > 0) hasEvents = true
      })
      return hasEvents
    }
    return true
  }

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      <header 
        className="bg-blue-600 text-white py-4 text-center text-2xl font-semibold sticky top-0 z-50 relative"
        role="banner"
      >
        <h1>Event Planner</h1>
        <KeyboardShortcutsDialog />
      </header>

      <div className="max-w-7xl mx-auto p-4">
        {/* Stepper with ARIA */}
        <nav 
          className="mb-6" 
          role="navigation" 
          aria-label="Progress"
        >
          <ol className="flex justify-between text-center text-sm text-gray-600">
            {steps.map((step, index) => (
              <li 
                key={step.id}
                className={`flex-1 pb-2 transition-colors ${
                  currentStep === index 
                    ? 'font-bold border-b-4 border-blue-600' 
                    : 'border-b border-gray-200'
                }`}
              >
                <button
                  onClick={() => goToStep(index)}
                  disabled={!canNavigateToStep(index)}
                  className={`w-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded ${
                    !canNavigateToStep(index) ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                  aria-current={currentStep === index ? 'step' : undefined}
                >
                  <span className="sr-only">Step {step.id}:</span>
                  {step.name}
                  <span className="sr-only">
                    {currentStep === index ? '(current step)' : ''}
                    {!canNavigateToStep(index) ? '(not available yet)' : ''}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        {/* Step Content */}
        <main className="step-content">
          <ErrorBoundary>
            {currentStep === 0 && (
              <div className="step-1">
                <h2 className="text-xl font-semibold mb-4">Select Event Dates</h2>
                <Calendar 
                  selectedDates={selectedDates}
                  onDateSelect={handleDateSelect}
                />
                <button 
                  onClick={() => goToStep(1)}
                  className="next-btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Next: Add Events
                </button>
              </div>
            )}

            {currentStep === 1 && (
              <div className="step-2">
                <ErrorBoundary>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Selected Dates List */}
                    <div className="space-y-4">
                      {Array.from(selectedDates.entries())
                        .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                        .map(([date, events]) => (
                          <button
                            key={date}
                            onClick={() => setActiveDate(date)}
                            className={`
                              w-full text-left p-4 rounded-lg transition-all
                              ${activeDate === date ? 'bg-blue-50 border-blue-500' : 'bg-white'}
                              hover:bg-blue-50
                            `}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{new Date(date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}</span>
                              <span className="text-sm text-gray-600">
                                {events.length} Event{events.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </button>
                        ))}
                    </div>

                    {/* Event Form */}
                    <div className="lg:sticky lg:top-20">
                      {activeDate ? (
                        <EventForm
                          date={activeDate}
                          events={selectedDates.get(activeDate) || []}
                          onSave={(events) => handleEventsUpdate(activeDate, events)}
                        />
                      ) : (
                        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                          Select a date to add or edit events
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <button 
                      onClick={() => goToStep(0)}
                      className="prev-btn bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                    >
                      ← Back
                    </button>
                    <button 
                      onClick={() => goToStep(2)}
                      className="next-btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      Review Menu →
                    </button>
                  </div>
                </ErrorBoundary>
              </div>
            )}

            {currentStep === 2 && (
              <div className="step-3">
                <h2 className="text-xl font-semibold mb-4">Review & Download</h2>
                <ErrorBoundary>
                  <Preview selectedDates={selectedDates} />
                </ErrorBoundary>
                <div className="flex justify-start mt-6">
                  <button 
                    onClick={() => goToStep(1)}
                    className="prev-btn bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                  >
                    ← Back
                  </button>
                </div>
              </div>
            )}
          </ErrorBoundary>
        </main>
      </div>

      {/* Save Toast */}
      <div
        id="save-toast"
        role="status"
        aria-live="polite"
        className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg transform transition-all duration-300 translate-y-full opacity-0"
      >
        Changes saved successfully
      </div>
    </div>
  )
}

export default App
