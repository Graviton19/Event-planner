import { useState } from 'react'
import { jsPDF } from 'jspdf'

const Preview = ({ selectedDates }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString(undefined, options)
  }

  const formatTime = (timeString) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const generatePDF = async () => {
    setIsGenerating(true)
    setError(null)
    setProgress(0)

    try {
      const doc = new jsPDF()
      
      // Colors for styling
      const primaryColor = [26, 35, 126] // Deep blue
      const accentColor = [211, 47, 47]  // Deep red
      const textColor = [33, 33, 33]     // Near black
      const subTextColor = [97, 97, 97]  // Dark gray
      const backgroundColor = [250, 250, 250] // Off-white

      // Clean background
      doc.setFillColor(...backgroundColor)
      doc.rect(0, 0, 210, 297, 'F')
      setProgress(10)

      // Header styling
      doc.setDrawColor(...primaryColor)
      doc.setLineWidth(0.75)
      doc.rect(15, 15, 180, 267)

      doc.setFontSize(28)
      doc.setTextColor(...primaryColor)
      doc.setFont("helvetica", "bold")
      doc.text("Event Menu Schedule", 105, 35, { align: "center" })
      setProgress(20)

      // Date of generation
      doc.setFontSize(11)
      doc.setTextColor(...subTextColor)
      doc.setFont("helvetica", "normal")
      doc.text(
        new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }), 
        105, 48, 
        { align: "center" }
      )

      let y = 60
      setProgress(30)

      // Sort dates
      const sortedDates = Array.from(selectedDates.keys())
        .sort((a, b) => new Date(a) - new Date(b))

      const totalDates = sortedDates.length
      let currentDateIndex = 0

      for (const date of sortedDates) {
        const events = selectedDates.get(date)
        if (!events || events.length === 0) continue

        // Sort events by time
        events.sort((a, b) => {
          const timeA = new Date(`1970-01-01T${a.time}`)
          const timeB = new Date(`1970-01-01T${b.time}`)
          return timeA - timeB
        })

        // Date header
        doc.setFontSize(16)
        doc.setTextColor(...primaryColor)
        doc.setFont("helvetica", "bold")
        const dateText = formatDate(date)
        doc.text(dateText, 20, y)
        
        // Date underline
        const dateWidth = doc.getTextWidth(dateText)
        doc.setDrawColor(...accentColor)
        doc.setLineWidth(0.3)
        doc.line(20, y + 2, 20 + dateWidth, y + 2)

        y += 10

        // Process events
        for (const event of events) {
          // Check if we need a new page
          if (y > 250) {
            doc.addPage()
            doc.setFillColor(...backgroundColor)
            doc.rect(0, 0, 210, 297, 'F')
            doc.setDrawColor(...primaryColor)
            doc.setLineWidth(0.75)
            doc.rect(15, 15, 180, 267)
            y = 30
          }

          // Calculate space needed
          const menuLines = event.menu.length + 2
          const boxHeight = Math.max(30, menuLines * 6)

          // Draw event box
          doc.setFillColor(245, 245, 245)
          doc.roundedRect(21, y + 1, 168, boxHeight, 2, 2, 'F')
          doc.setFillColor(255, 255, 255)
          doc.roundedRect(20, y, 168, boxHeight, 2, 2, 'FD')

          // Event details
          doc.setFontSize(14)
          doc.setTextColor(...primaryColor)
          doc.setFont("helvetica", "bold")
          doc.text(event.name, 25, y + 8)

          doc.setFontSize(10)
          doc.setTextColor(...textColor)
          doc.setFont("helvetica", "normal")
          doc.text(`Time: ${formatTime(event.time)}`, 25, y + 16)

          // Menu section
          let menuY = y + 24
          doc.setFontSize(12)
          doc.setTextColor(...accentColor)
          doc.setFont("helvetica", "bold")
          doc.text('Menu Selection', 25, menuY)
          
          menuY += 8

          // Menu items
          doc.setFontSize(10)
          doc.setTextColor(...textColor)
          doc.setFont("helvetica", "normal")
          for (const item of event.menu) {
            doc.text('•', 30, menuY)
            doc.text(item, 34, menuY)
            menuY += 6
          }

          // Add notes if present
          if (event.notes) {
            doc.setFontSize(10)
            doc.setTextColor(...subTextColor)
            doc.setFont("helvetica", "italic")
            doc.text('Notes:', 25, menuY + 4)
            const splitNotes = doc.splitTextToSize(event.notes, 155)
            doc.text(splitNotes, 25, menuY + 10)
            menuY += (splitNotes.length * 5) + 10
          }

          y = menuY + 10
        }

        currentDateIndex++
        setProgress(30 + (60 * currentDateIndex / totalDates))
      }

      // Add page numbers
      const pageCount = doc.internal.getNumberOfPages()
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(9)
        doc.setTextColor(...subTextColor)
        doc.setFont("helvetica", "normal")
        doc.text(
          `Page ${i} of ${pageCount}`, 
          105, 
          285, 
          { align: "center" }
        )
      }

      setProgress(95)
      doc.save("event-menu-schedule.pdf")
      setProgress(100)
    } catch (err) {
      console.error('PDF generation error:', err)
      setError('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-4 text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="space-y-8">
        {Array.from(selectedDates.entries())
          .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
          .map(([date, events]) => (
            <div key={date} className="date-section">
              <h3 className="text-xl font-semibold mb-4">{formatDate(date)}</h3>
              
              <div className="space-y-4">
                {events.map((event, index) => (
                  <div key={index} className="event-preview bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <h4 className="text-lg font-medium text-blue-600">
                        {event.name}
                      </h4>
                      <span className="text-gray-600">
                        {formatTime(event.time)}
                      </span>
                    </div>
                    
                    {event.members && (
                      <p className="text-gray-600 mb-2">
                        Number of guests: {event.members}
                      </p>
                    )}
                    
                    {event.venue && (
                      <p className="text-gray-600 mb-2">
                        Venue: {event.venue}
                      </p>
                    )}
                    
                    <div className="menu-preview mt-3">
                      <h5 className="font-medium mb-2">Menu Items:</h5>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {event.menu.map(item => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {event.notes && (
                      <div className="mt-4 pt-4 border-t text-gray-600">
                        <strong>Notes:</strong> {event.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={generatePDF}
          disabled={isGenerating || selectedDates.size === 0}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-medium
            transition-all transform
            ${isGenerating 
              ? 'bg-blue-400 cursor-not-allowed' 
              : selectedDates.size === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5'
            }
            text-white
          `}
        >
          {isGenerating ? (
            <>
              <svg 
                className="animate-spin h-5 w-5" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generating PDF...
            </>
          ) : (
            <>
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Schedule PDF
            </>
          )}
        </button>

        {isGenerating && (
          <div className="flex-1 max-w-xs">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {progress < 100 ? 'Generating PDF...' : 'Complete!'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Preview