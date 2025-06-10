'use client'

import { useState } from 'react'
import { Filter, X, Search } from 'lucide-react'

export interface FilterOptions {
  priceRange: [number, number]
  propertyType: string[]
  bedrooms: number[]
  bathrooms: number[]
  amenities: string[]
  areaRange: [number, number]
  sortBy: string
}

interface AdvancedFiltersProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: FilterOptions) => void
  initialFilters?: Partial<FilterOptions>
}

const AMENITIES = [
  'Swimming Pool', 'Gym', 'Parking', 'Garden', 'Balcony', 'Air Conditioning',
  'Heating', 'Fireplace', 'Dishwasher', 'Laundry', 'Security', 'Elevator'
]

const PROPERTY_TYPES = ['House', 'Apartment', 'Condo', 'Townhouse', 'Villa', 'Studio']

export default function AdvancedFilters({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  initialFilters = {} 
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: initialFilters.priceRange || [0, 2000000],
    propertyType: initialFilters.propertyType || [],
    bedrooms: initialFilters.bedrooms || [],
    bathrooms: initialFilters.bathrooms || [],
    amenities: initialFilters.amenities || [],
    areaRange: initialFilters.areaRange || [0, 5000],
    sortBy: initialFilters.sortBy || 'price-asc'
  })

  const handlePriceChange = (index: number, value: string) => {
    const newRange = [...filters.priceRange] as [number, number]
    newRange[index] = parseInt(value) || 0
    setFilters({ ...filters, priceRange: newRange })
  }

  const handleAreaChange = (index: number, value: string) => {
    const newRange = [...filters.areaRange] as [number, number]
    newRange[index] = parseInt(value) || 0
    setFilters({ ...filters, areaRange: newRange })
  }

  const toggleArrayFilter = (key: keyof FilterOptions, value: string | number) => {
    const currentArray = filters[key] as (string | number)[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    setFilters({ ...filters, [key]: newArray })
  }

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 2000000],
      propertyType: [],
      bedrooms: [],
      bathrooms: [],
      amenities: [],
      areaRange: [0, 5000],
      sortBy: 'price-asc'
    })
  }

  const handleApply = () => {
    onApplyFilters(filters)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <Filter className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-semibold text-slate-900">Advanced Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Price Range */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Price Range</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Min Price</label>
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(0, e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Max Price</label>
                <input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(1, e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="2000000"
                />
              </div>
            </div>
          </div>

          {/* Property Type */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Property Type</h3>
            <div className="grid grid-cols-3 gap-3">
              {PROPERTY_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => toggleArrayFilter('propertyType', type)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    filters.propertyType.includes(type)
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-amber-500'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Bedrooms</h3>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    onClick={() => toggleArrayFilter('bedrooms', num)}
                    className={`w-12 h-12 rounded-lg border transition-all ${
                      filters.bedrooms.includes(num)
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-amber-500'
                    }`}
                  >
                    {num}+
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Bathrooms</h3>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    onClick={() => toggleArrayFilter('bathrooms', num)}
                    className={`w-12 h-12 rounded-lg border transition-all ${
                      filters.bathrooms.includes(num)
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-amber-500'
                    }`}
                  >
                    {num}+
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Area Range */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Area (sq ft)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Min Area</label>
                <input
                  type="number"
                  value={filters.areaRange[0]}
                  onChange={(e) => handleAreaChange(0, e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Max Area</label>
                <input
                  type="number"
                  value={filters.areaRange[1]}
                  onChange={(e) => handleAreaChange(1, e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="5000"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Amenities</h3>
            <div className="grid grid-cols-3 gap-3">
              {AMENITIES.map(amenity => (
                <button
                  key={amenity}
                  onClick={() => toggleArrayFilter('amenities', amenity)}
                  className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                    filters.amenities.includes(amenity)
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-amber-500'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Sort By</h3>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="area-asc">Area: Small to Large</option>
              <option value="area-desc">Area: Large to Small</option>
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={clearFilters}
            className="px-6 py-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            Clear All
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
