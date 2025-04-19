import { useState } from 'react'

const Calendar = ({ selectedDates, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionDirection, setTransitionDirection] = useState('')

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const minYear = today.getFullYear()
  const maxYear = minYear + 10

  const changeMonth = (direction) => {
    setIsTransitioning(true)
    setTransitionDirection(direction)

    setTimeout(() => {
      if (direction === 'next') {
        if (currentMonth === 11) {
          setCurrentMonth(0)
          setCurrentYear(prev => prev + 1)
        } else {
          setCurrentMonth(prev => prev + 1)
        }
      } else {
        if (currentMonth === 0) {
          setCurrentMonth(11)
          setCurrentYear(prev => prev - 1)
        } else {
          setCurrentMonth(prev => prev - 1)
        }
      }
      setIsTransitioning(false)
    }, 200)
  }

  const generateCalendarDates = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    
    const calendarDays = []
    
    // Add day headers
    dayHeaders.forEach(day => {
      calendarDays.push({ type: 'header', value: day })
    })
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push({ type: 'empty' })
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const dateString = date.toISOString().split('T')[0]
      const isDisabled = date < today
      const isSelected = selectedDates.has(dateString)
      
      calendarDays.push({
        type: 'day',
        value: day,
        date: dateString,
        isDisabled,
        isSelected
      })
    }
    
    return calendarDays
  }

  const handleDateClick = (dateString) => {
    if (!dateString) return
    onDateSelect(dateString)
  }

  return (
    <div className="bg-white p-4 shadow rounded mb-6">
      <div className="calendar-controls mb-4 flex items-center justify-between">
        <button
          onClick={() => changeMonth('prev')}
          disabled={currentYear === minYear && currentMonth === 0}
          className={`
            month-nav prev px-2 py-1 rounded transition-colors
            ${currentYear === minYear && currentMonth === 0 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'hover:bg-gray-100'
            }
          `}
        >
          ←
        </button>
        
        <div className="flex gap-4">
          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(Number(e.target.value))}
            className="p-2 border rounded"
          >
            {months.map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>
          
          <select
            value={currentYear}
            onChange={(e) => setCurrentYear(Number(e.target.value))}
            className="p-2 border rounded"
          >
            {Array.from(
              { length: maxYear - minYear + 1 },
              (_, i) => minYear + i
            ).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <button
          onClick={() => changeMonth('next')}
          disabled={currentYear === maxYear && currentMonth === 11}
          className={`
            month-nav next px-2 py-1 rounded transition-colors
            ${currentYear === maxYear && currentMonth === 11
              ? 'text-gray-300 cursor-not-allowed'
              : 'hover:bg-gray-100'
            }
          `}
        >
          →
        </button>
      </div>

      <div 
        className={`
          calendar grid grid-cols-7 gap-1 transition-opacity duration-200
          ${isTransitioning ? 'opacity-0' : 'opacity-100'}
          ${transitionDirection === 'next' ? 'translate-x-full' : ''}
          ${transitionDirection === 'prev' ? '-translate-x-full' : ''}
        `}
      >
        {generateCalendarDates().map((day, index) => {
          if (day.type === 'header') {
            return (
              <div key={index} className="day-header text-center font-medium py-2">
                {day.value}
              </div>
            )
          }
          
          if (day.type === 'empty') {
            return <div key={index} className="empty-slot" />
          }
          
          return (
            <button
              key={index}
              onClick={() => !day.isDisabled && handleDateClick(day.date)}
              disabled={day.isDisabled}
              className={`
                date p-2 rounded transition-all
                ${day.isDisabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-blue-50'}
                ${day.isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
              `}
            >
              {day.value}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar