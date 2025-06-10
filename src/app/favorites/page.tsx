'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Trash2, Scale, Filter } from 'lucide-react'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useComparison } from '@/contexts/ComparisonContext'
import PropertyComparison from '@/components/PropertyComparison'
import AdvancedFilters, { FilterOptions } from '@/components/AdvancedFilters'

export default function FavoritesPage() {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites()
  const { comparisonList } = useComparison()
  const [showComparison, setShowComparison] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filteredFavorites, setFilteredFavorites] = useState(favorites)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleApplyFilters = (filters: FilterOptions) => {
    let filtered = [...favorites]

    // Apply price filter
    filtered = filtered.filter(property => 
      property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1]
    )

    // Apply property type filter
    if (filters.propertyType.length > 0) {
      filtered = filtered.filter(property => 
        filters.propertyType.some(type => 
          property.title.toLowerCase().includes(type.toLowerCase())
        )
      )
    }

    // Apply bedrooms filter
    if (filters.bedrooms.length > 0) {
      filtered = filtered.filter(property => 
        filters.bedrooms.includes(property.bedrooms)
      )
    }

    // Apply bathrooms filter
    if (filters.bathrooms.length > 0) {
      filtered = filtered.filter(property => 
        filters.bathrooms.includes(property.bathrooms)
      )
    }

    // Apply area filter
    filtered = filtered.filter(property => 
      property.area >= filters.areaRange[0] && property.area <= filters.areaRange[1]
    )

    // Apply amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(property => 
        property.amenities && filters.amenities.some(amenity => 
          property.amenities!.includes(amenity)
        )
      )
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'area-asc':
        filtered.sort((a, b) => a.area - b.area)
        break
      case 'area-desc':
        filtered.sort((a, b) => b.area - a.area)
        break
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
    }

    setFilteredFavorites(filtered)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-light mb-4">
                My <span className="font-bold text-red-400">Favorites</span>
              </h1>
              <p className="text-xl text-white/90">
                Your saved properties and wishlist
              </p>
            </div>
            
            <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Filter className="w-5 h-5" />
                <span>Filter</span>
              </button>
              
              {comparisonList.length > 0 && (
                <button
                  onClick={() => setShowComparison(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Scale className="w-5 h-5" />
                  <span>Compare ({comparisonList.length})</span>
                </button>
              )}
              
              {favorites.length > 0 && (
                <button
                  onClick={clearFavorites}
                  className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">No Favorites Yet</h2>
            <p className="text-slate-600 mb-8">
              Start adding properties to your favorites by clicking the heart icon on property cards.
            </p>
            <Link
              href="/properties"
              className="btn-gold px-8 py-3 text-lg font-semibold"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-8 p-6 bg-white rounded-xl shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{favorites.length}</div>
                  <div className="text-sm text-slate-600">Total Favorites</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {favorites.filter(p => p.type === 'sale').length}
                  </div>
                  <div className="text-sm text-slate-600">For Sale</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {favorites.filter(p => p.type === 'rent').length}
                  </div>
                  <div className="text-sm text-slate-600">For Rent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {formatPrice(favorites.reduce((sum, p) => sum + p.price, 0) / favorites.length)}
                  </div>
                  <div className="text-sm text-slate-600">Avg Price</div>
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(filteredFavorites.length > 0 ? filteredFavorites : favorites).map((property) => (
                <div key={property.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeFromFavorites(property.id)}
                      className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        property.type === 'sale' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-blue-500 text-white'
                      }`}>
                        For {property.type === 'sale' ? 'Sale' : 'Rent'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
                      {property.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4">{property.location}</p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-xl font-bold text-amber-600">
                        {formatPrice(property.price)}
                        {property.type === 'rent' && <span className="text-sm text-slate-500">/month</span>}
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-slate-600 text-sm mb-4">
                      <span>{property.bedrooms} bed</span>
                      <span>{property.bathrooms} bath</span>
                      <span>{property.area} sq ft</span>
                    </div>
                    
                    <button className="w-full btn-gold py-2 text-sm font-semibold">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <PropertyComparison 
        isOpen={showComparison} 
        onClose={() => setShowComparison(false)} 
      />
      
      <AdvancedFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  )
}
