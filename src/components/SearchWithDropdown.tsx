'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, Home, Tag } from 'lucide-react'
import { mockProperties } from '@/lib/mockData'

interface SearchSuggestion {
  id: string
  type: 'location' | 'property' | 'amenity' | 'type'
  text: string
  subtitle?: string
  icon: React.ReactNode
}

interface SearchWithDropdownProps {
  value: string
  onChange: (value: string) => void
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
  showButton?: boolean
  buttonText?: string
}

export default function SearchWithDropdown({
  value,
  onChange,
  onSearch,
  placeholder = "Location, property type, or keywords...",
  className = "",
  showButton = true,
  buttonText = "Search Properties"
}: SearchWithDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Generate suggestions based on input
  useEffect(() => {
    if (value.length < 2) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    const query = value.toLowerCase()
    const newSuggestions: SearchSuggestion[] = []

    // Get unique locations (cities and states)
    const locations = new Set<string>()
    const propertyTypes = new Set<string>()
    const amenities = new Set<string>()

    mockProperties.forEach(property => {
      // Add cities
      if (property.city.toLowerCase().includes(query)) {
        locations.add(`${property.city}, ${property.state}`)
      }
      
      // Add states
      if (property.state.toLowerCase().includes(query)) {
        locations.add(property.state)
      }

      // Add property types
      if (property.property_type.toLowerCase().includes(query)) {
        propertyTypes.add(property.property_type)
      }

      // Add amenities
      property.amenities.forEach(amenity => {
        if (amenity.toLowerCase().includes(query)) {
          amenities.add(amenity)
        }
      })

      // Add property titles
      if (property.title.toLowerCase().includes(query)) {
        newSuggestions.push({
          id: `property-${property.id}`,
          type: 'property',
          text: property.title,
          subtitle: `${property.city}, ${property.state}`,
          icon: <Home className="w-4 h-4 text-blue-600" />
        })
      }
    })

    // Add location suggestions
    Array.from(locations).slice(0, 3).forEach(location => {
      newSuggestions.push({
        id: `location-${location}`,
        type: 'location',
        text: location,
        subtitle: 'Location',
        icon: <MapPin className="w-4 h-4 text-green-600" />
      })
    })

    // Add property type suggestions
    Array.from(propertyTypes).slice(0, 2).forEach(type => {
      newSuggestions.push({
        id: `type-${type}`,
        type: 'type',
        text: `For ${type === 'sale' ? 'Sale' : 'Rent'}`,
        subtitle: 'Property Type',
        icon: <Tag className="w-4 h-4 text-purple-600" />
      })
    })

    // Add amenity suggestions
    Array.from(amenities).slice(0, 3).forEach(amenity => {
      newSuggestions.push({
        id: `amenity-${amenity}`,
        type: 'amenity',
        text: amenity,
        subtitle: 'Amenity',
        icon: <Tag className="w-4 h-4 text-orange-600" />
      })
    })

    // Add popular search terms if no specific matches
    if (newSuggestions.length < 3) {
      const popularTerms = [
        { text: 'Luxury apartments', subtitle: 'Popular search' },
        { text: 'Family homes', subtitle: 'Popular search' },
        { text: 'Downtown condos', subtitle: 'Popular search' },
        { text: 'Waterfront properties', subtitle: 'Popular search' },
        { text: 'Pet-friendly rentals', subtitle: 'Popular search' }
      ]

      popularTerms.forEach(term => {
        if (term.text.toLowerCase().includes(query) && newSuggestions.length < 8) {
          newSuggestions.push({
            id: `popular-${term.text}`,
            type: 'property',
            text: term.text,
            subtitle: term.subtitle,
            icon: <Search className="w-4 h-4 text-slate-500" />
          })
        }
      })
    }

    setSuggestions(newSuggestions.slice(0, 8)) // Limit to 8 suggestions
    setIsOpen(newSuggestions.length > 0)
  }, [value])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text)
    setIsOpen(false)
    if (onSearch) {
      onSearch(suggestion.text)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsOpen(false)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true)
    }
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              className={`w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white text-slate-900 ${
                className.includes('home') ? 'px-6 py-4 bg-amber-50 rounded-xl text-lg' : ''
              }`}
              autoComplete="off"
            />
          </div>

          {/* Dropdown */}
          {isOpen && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 flex items-center space-x-3"
                >
                  {suggestion.icon}
                  <div className="flex-1">
                    <div className="text-slate-900 font-medium">{suggestion.text}</div>
                    {suggestion.subtitle && (
                      <div className="text-slate-500 text-sm">{suggestion.subtitle}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {showButton && (
          <button
            type="submit"
            className="btn-gold flex items-center justify-center px-8 py-3 text-lg font-semibold"
          >
            <Search className="w-5 h-5 mr-3" />
            {buttonText}
          </button>
        )}
      </form>
    </div>
  )
}
