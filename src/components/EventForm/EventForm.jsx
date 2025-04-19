import { useState } from 'react'
import { occasionTemplates } from '../../data/menuData'
import MenuSelector from '../MenuSelector/MenuSelector'

const EventForm = ({ date, events = [], onSave, onDelete }) => {
  const [selectedItems, setSelectedItems] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formatTime = (timeString) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const validateForm = (data) => {
    const newErrors = {}
    if (!data.name.trim()) newErrors.name = 'Event name is required'
    if (!data.time) newErrors.time = 'Time is required'
    if (data.members && Number(data.members) <= 0) newErrors.members = 'Number of members must be positive'
    if (selectedItems.length === 0) newErrors.menu = 'Please select at least one menu item'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.target)
    
    const eventData = {
      name: formData.get('occasion'),
      time: formData.get('time'),
      members: formData.get('members'),
      venue: formData.get('venue'),
      notes: formData.get('notes'),
      menu: selectedItems
    }

    const formErrors = validateForm(eventData)
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      setIsSubmitting(false)
      return
    }

    try {
      if (isEditing && editIndex !== null) {
        const updatedEvents = [...events]
        updatedEvents[editIndex] = eventData
        onSave(updatedEvents)
        setIsEditing(false)
        setEditIndex(null)
      } else {
        onSave([...events, eventData])
      }

      e.target.reset()
      setSelectedItems([])
      setErrors({})
    } catch (err) {
      setErrors({ submit: 'Failed to save event. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (index) => {
    const event = events[index]
    const form = document.querySelector('form')
    
    form.occasion.value = event.name
    form.time.value = event.time
    form.members.value = event.members || ''
    form.venue.value = event.venue || ''
    form.notes.value = event.notes || ''
    
    setSelectedItems(event.menu)
    setIsEditing(true)
    setEditIndex(index)
  }

  const handleDelete = (index) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    const updatedEvents = events.filter((_, i) => i !== index)
    onSave(updatedEvents)
  }

  const handleTemplateSelect = (e) => {
    const template = occasionTemplates[e.target.value]
    if (!template) return

    const form = e.target.form
    form.occasion.value = template.name
    
    // Merge all menu items from the template
    const templateItems = Object.values(template.menuItems).flat()
    setSelectedItems(templateItems)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        {events.length} Event{events.length !== 1 ? 's' : ''} on {date}
      </h3>

      {/* Event List */}
      <div className="space-y-4 mb-6">
        {events.map((event, index) => (
          <div key={index} className="event-item bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">{event.name}</h4>
              <div className="text-gray-600">{formatTime(event.time)}</div>
            </div>
            
            {event.members && (
              <p className="text-gray-600 text-sm">Members: {event.members}</p>
            )}
            
            {event.venue && (
              <p className="text-gray-600 text-sm">Venue: {event.venue}</p>
            )}
            
            {event.menu?.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <h5 className="text-sm font-medium mb-2">Menu Items:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {event.menu.map(item => (
                    <li key={item} className="flex items-center gap-2">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {event.notes && (
              <p className="mt-3 pt-3 border-t text-gray-600 text-sm">
                <strong>Notes:</strong> {event.notes}
              </p>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => handleEdit(index)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Event Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Occasion Template</label>
            <select
              onChange={handleTemplateSelect}
              className="w-full p-2 border rounded"
              defaultValue=""
            >
              <option value="">✨ Select an Occasion Template</option>
              {Object.entries(occasionTemplates).map(([id, template]) => (
                <option key={id} value={id}>{template.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Event Name *</label>
            <input
              type="text"
              name="occasion"
              required
              className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Enter event name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Time *</label>
            <input
              type="time"
              name="time"
              required
              className={`w-full p-2 border rounded ${errors.time ? 'border-red-500' : ''}`}
            />
            {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Number of Members</label>
            <input
              type="number"
              name="members"
              min="1"
              className={`w-full p-2 border rounded ${errors.members ? 'border-red-500' : ''}`}
              placeholder="Enter number of guests"
            />
            {errors.members && <p className="text-red-500 text-sm mt-1">{errors.members}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Venue</label>
            <input
              type="text"
              name="venue"
              className="w-full p-2 border rounded"
              placeholder="Enter venue details"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              name="notes"
              rows="3"
              className="w-full p-2 border rounded"
              placeholder="Any additional notes..."
            ></textarea>
          </div>
        </div>

        {/* Menu Selection */}
        <div className="border-t pt-6">
          <h4 className="text-lg font-medium mb-4">Select Menu Items</h4>
          <MenuSelector
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
          />
          {errors.menu && <p className="text-red-500 text-sm mt-1">{errors.menu}</p>}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isEditing ? 'Update Event' : 'Add Event'}
          </button>
        </div>
        {errors.submit && <p className="text-red-500 text-sm mt-4">{errors.submit}</p>}
      </form>
    </div>
  )
}

export default EventForm