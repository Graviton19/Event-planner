import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import debounce from 'lodash.debounce'
import { menuCategories, menuItems, dietaryIcons } from '../../data/menuData'
import useMenuKeyboardNavigation from '../../hooks/useMenuKeyboardNavigation'

const MenuSelector = ({ selectedItems = [], onSelectionChange }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState(new Set())
  const [customItems, setCustomItems] = useState({})
  const [isSearching, setIsSearching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState(null)
  const menuGridRef = useRef(null)
  const handleKeyDown = useMenuKeyboardNavigation(menuGridRef)

  const groupedMenuItems = useMemo(() => {
    const groups = {}
    Object.entries(menuCategories).forEach(([categoryId, category]) => {
      groups[categoryId] = {
        category,
        items: [...(menuItems[categoryId] || []), ...(customItems[categoryId] || [])]
      }
    })
    return groups
  }, [customItems])

  const filteredItems = useMemo(() => {
    const searchStr = searchQuery.toLowerCase()
    const results = {}

    Object.entries(groupedMenuItems).forEach(([categoryId, { category, items }]) => {
      const filteredItems = items.filter(item => {
        const matchesSearch = searchStr === '' ||
          item.name.toLowerCase().includes(searchStr) ||
          (item.description || '').toLowerCase().includes(searchStr)

        const matchesFilters = activeFilters.size === 0 ||
          Array.from(activeFilters).every(filter => item.dietary?.includes(filter))

        return matchesSearch && matchesFilters
      })

      if (filteredItems.length > 0) {
        results[categoryId] = {
          category,
          items: filteredItems
        }
      }
    })

    return results
  }, [groupedMenuItems, searchQuery, activeFilters])

  useEffect(() => {
    const savedItems = localStorage.getItem('customMenuItems')
    if (savedItems) {
      try {
        setCustomItems(JSON.parse(savedItems))
      } catch (e) {
        console.error('Error loading custom items:', e)
      }
    }
  }, [])

  const handleSearch = debounce((query) => {
    setIsSearching(true)
    setSearchQuery(query)
    setTimeout(() => setIsSearching(false), 300)
  }, 300)

  const toggleFilter = useCallback((filter) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev)
      if (newFilters.has(filter)) {
        newFilters.delete(filter)
      } else {
        newFilters.add(filter)
      }
      return newFilters
    })
  }, [])

  const handleCustomItemSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const form = e.target
      const name = form.name.value.trim()
      const category = form.category.value
      const description = form.description?.value.trim()
      const dietary = Array.from(form.dietary?.selectedOptions || []).map(opt => opt.value)

      if (!name || !category) return

      const newItem = {
        id: `custom-${Date.now()}-${name.toLowerCase().replace(/\s+/g, '-')}`,
        name,
        description,
        dietary
      }

      const updatedCustomItems = {
        ...customItems,
        [category]: [...(customItems[category] || []), newItem]
      }

      setCustomItems(updatedCustomItems)
      localStorage.setItem('customMenuItems', JSON.stringify(updatedCustomItems))
      form.reset()
    } catch (error) {
      console.error('Error adding custom item:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleItemSelection = useCallback((itemId) => {
    onSelectionChange(
      selectedItems.includes(itemId)
        ? selectedItems.filter(id => id !== itemId)
        : [...selectedItems, itemId]
    )
  }, [selectedItems, onSelectionChange])

  const toggleCategory = useCallback((categoryId) => {
    setExpandedCategory(prev => prev === categoryId ? null : categoryId)
  }, [])

  return (
    <div className="menu-selection">
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search menu items..."
            className="w-full p-3 pl-10 border rounded-lg"
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Search menu items"
          />
          <svg
            className={`absolute left-3 top-3.5 w-4 h-4 text-gray-400 transition-transform ${isSearching ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div 
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Dietary filters"
        >
          {Object.entries(dietaryIcons).map(([filter, icon]) => (
            <button
              key={filter}
              onClick={() => toggleFilter(filter)}
              className={`filter-btn px-3 py-1 rounded-full border transition-colors ${
                activeFilters.has(filter) ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
              }`}
              aria-pressed={activeFilters.has(filter)}
            >
              <span className="sr-only">Filter by</span>
              {icon} {filter.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion Menu Categories */}
      <div 
        className="space-y-4"
        ref={menuGridRef}
        onKeyDown={handleKeyDown}
        role="menu"
        aria-label="Menu items grid"
      >
        {Object.entries(filteredItems).length === 0 ? (
          <div className="text-center text-gray-500 py-8" role="status">
            No items match your search and filters
          </div>
        ) : (
          Object.entries(filteredItems).map(([categoryId, { category, items }]) => (
            <div key={categoryId} className="bg-white rounded-lg shadow">
              <button
                onClick={() => toggleCategory(categoryId)}
                className="w-full text-left p-4 border-b flex justify-between items-center"
                aria-expanded={expandedCategory === categoryId}
                aria-controls={`category-panel-${categoryId}`}
              >
                <div className="flex items-center gap-2">
                  <span>{category.icon} {category.name}</span>
                  <span className="text-sm text-gray-500">{category.description}</span>
                </div>
                <span className="text-gray-500">
                  {expandedCategory === categoryId ? '−' : '+'}
                </span>
              </button>

              {expandedCategory === categoryId && (
                <div
                  id={`category-panel-${categoryId}`}
                  className="menu-items grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
                >
                  {items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => toggleItemSelection(item.id)}
                      className={`menu-item text-left p-3 rounded-lg border transition-all ${
                        selectedItems.includes(item.id)
                          ? 'bg-blue-50 border-blue-500'
                          : 'border-gray-200'
                      } hover:border-blue-300 hover:shadow-sm`}
                      role="menuitem"
                      aria-selected={selectedItems.includes(item.id)}
                      tabIndex={0}
                    >
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2" aria-label="Dietary information">
                        {item.dietary?.map(diet => (
                          <span
                            key={diet}
                            className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded"
                          >
                            {dietaryIcons[diet]} {diet.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Custom Item Form */}
      {/* This section remains the same */}
      {/* ... */}
    </div>
  )
}

export default MenuSelector
