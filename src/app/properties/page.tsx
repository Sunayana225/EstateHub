'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PropertyCard from '@/components/PropertyCard'
import { Property } from '@/lib/types'
import { Search, Filter, SlidersHorizontal, MapPin, Globe } from 'lucide-react'
import { LOCATION_DATA } from '@/utils/realEstateAPI'
import { mockProperties } from '@/lib/mockData'
import SearchWithDropdown from '@/components/SearchWithDropdown'

function PropertiesContent() {
  const searchParams = useSearchParams()
  const [properties] = useState<Property[]>(mockProperties)
  const [searchQuery, setSearchQuery] = useState('')
  const [propertyType, setPropertyType] = useState<'all' | 'sale' | 'rent'>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  const [bedrooms, setBedrooms] = useState<number | 'any'>('any')
  const [showFilters, setShowFilters] = useState(false)

  // Location filters
  const [selectedCountry, setSelectedCountry] = useState<string>('all')
  const [selectedState, setSelectedState] = useState<string>('all')

  // Handle URL search parameters
  useEffect(() => {
    const query = searchParams.get('search')
    const type = searchParams.get('type')

    if (query) {
      setSearchQuery(query)
    }
    if (type && (type === 'sale' || type === 'rent')) {
      setPropertyType(type)
    }
  }, [searchParams])

  // Get available countries, states, and cities
  const countries = ['all', ...Object.keys(LOCATION_DATA)]
  const countryData = selectedCountry === 'all' ? null : LOCATION_DATA[selectedCountry as keyof typeof LOCATION_DATA]
  const states = selectedCountry === 'all' ? ['all'] : ['all', ...(countryData ? Object.keys(countryData) : [])]

  // Location filter handlers
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country)
    setSelectedState('all') // Reset state when country changes
  }

  const handleStateChange = (state: string) => {
    setSelectedState(state)
  }

  const filteredProperties = properties.filter(property => {
    // Enhanced search functionality
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = searchQuery === '' ||
                         property.title.toLowerCase().includes(searchLower) ||
                         property.city.toLowerCase().includes(searchLower) ||
                         property.state.toLowerCase().includes(searchLower) ||
                         property.address.toLowerCase().includes(searchLower) ||
                         property.description.toLowerCase().includes(searchLower) ||
                         property.amenities.some(amenity => amenity.toLowerCase().includes(searchLower))

    const matchesType = propertyType === 'all' || property.property_type === propertyType
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1]
    const matchesBedrooms = bedrooms === 'any' || property.bedrooms === bedrooms

    // Enhanced location filters for international properties
    const getCountryFromState = (state: string) => {
      if (['NY', 'CA', 'TX', 'FL', 'MA'].includes(state)) return 'United States'
      if (['Ontario', 'British Columbia'].includes(state)) return 'Canada'
      if (['England', 'Scotland'].includes(state)) return 'United Kingdom'
      if (['New South Wales', 'Victoria'].includes(state)) return 'Australia'
      return 'Unknown'
    }

    const propertyCountry = getCountryFromState(property.state)
    const matchesCountry = selectedCountry === 'all' || selectedCountry === propertyCountry

    const getStateName = (state: string) => {
      const stateMap: Record<string, string> = {
        'NY': 'New York',
        'CA': 'California',
        'TX': 'Texas',
        'FL': 'Florida',
        'MA': 'Massachusetts',
        'Ontario': 'Ontario',
        'British Columbia': 'British Columbia',
        'England': 'England',
        'Scotland': 'Scotland',
        'New South Wales': 'New South Wales',
        'Victoria': 'Victoria'
      }
      return stateMap[state] || state
    }

    const propertyStateName = getStateName(property.state)
    const matchesState = selectedState === 'all' || selectedState === propertyStateName

    return matchesSearch && matchesType && matchesPrice && matchesBedrooms && matchesCountry && matchesState
  })

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Properties</h1>
          
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <SearchWithDropdown
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by location, property type, or keywords..."
                showButton={false}
                className="search-with-dropdown-properties"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center justify-center lg:w-auto"
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Enhanced Filters Panel */}
          {showFilters && (
            <div className="property-filters mt-6 p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
              {/* Location Filters Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-amber-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Location Filters</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Country Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Country
                    </label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white text-slate-900 font-medium"
                      style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    >
                      <option value="all">All Countries</option>
                      {countries.slice(1).map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  {/* State Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      State/Province
                    </label>
                    <select
                      value={selectedState}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white text-slate-900 font-medium"
                      style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                      disabled={selectedCountry === 'all'}
                    >
                      <option value="all">All States</option>
                      {states.slice(1).map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Property Filters Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <SlidersHorizontal className="w-5 h-5 text-amber-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Property Filters</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Property Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Type
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value as 'all' | 'sale' | 'rent')}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white text-slate-900 font-medium"
                      style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    >
                      <option value="all">All Types</option>
                      <option value="sale">For Sale</option>
                      <option value="rent">For Rent</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white text-slate-900"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrooms
                    </label>
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value === 'any' ? 'any' : Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white text-slate-900 font-medium"
                      style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    >
                      <option value="any">Any</option>
                      <option value={1}>1 Bedroom</option>
                      <option value={2}>2 Bedrooms</option>
                      <option value={3}>3 Bedrooms</option>
                      <option value={4}>4+ Bedrooms</option>
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setPropertyType('all')
                        setPriceRange([0, 1000000])
                        setBedrooms('any')
                        setSelectedCountry('all')
                        setSelectedState('all')
                      }}
                      className="w-full btn-secondary"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Filters Display */}
        {(selectedCountry !== 'all' || selectedState !== 'all' || propertyType !== 'all' || searchQuery) && (
          <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-900">Active Filters:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCountry !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  <Globe className="w-3 h-3 mr-1" />
                  {selectedCountry}
                </span>
              )}
              {selectedState !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  <MapPin className="w-3 h-3 mr-1" />
                  {selectedState}
                </span>
              )}
              {propertyType !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  For {propertyType === 'sale' ? 'Sale' : 'Rent'}
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Search className="w-3 h-3 mr-1" />
                  &ldquo;{searchQuery}&rdquo;
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <p className="text-slate-600">
            {filteredProperties.length} properties found
            {selectedCountry !== 'all' && ` in ${selectedCountry}`}
            {selectedState !== 'all' && `, ${selectedState}`}
          </p>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property, index) => (
              <div key={property.id} className={index === 0 ? "property-card" : ""}>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setPropertyType('all')
                setPriceRange([0, 1000000])
                setBedrooms('any')
                setSelectedCountry('all')
                setSelectedState('all')
              }}
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading properties...</p>
        </div>
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  )
}
