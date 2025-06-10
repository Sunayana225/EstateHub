'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Property } from '@/lib/types'
import { MapPin, Bed, Bath, Square, Heart, Scale } from 'lucide-react'
import { useState } from 'react'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useComparison } from '@/contexts/ComparisonContext'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageError, setImageError] = useState(false)
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const { addToComparison, removeFromComparison, isInComparison, comparisonList, maxComparisons } = useComparison()

  // Fallback image URL
  const fallbackImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&crop=center'

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    )
  }

  const handleFavoriteClick = () => {
    // Convert Property to FavoritesProperty format
    const favProperty = {
      id: property.id,
      title: property.title,
      price: property.price,
      location: `${property.city}, ${property.state}`,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area_sqft,
      type: property.property_type as 'sale' | 'rent',
      image: property.images?.[0] || fallbackImage,
      description: property.description,
      amenities: property.amenities
    }

    if (isFavorite(property.id)) {
      removeFromFavorites(property.id)
    } else {
      addToFavorites(favProperty)
    }
  }

  const handleComparisonClick = () => {
    const compProperty = {
      id: property.id,
      title: property.title,
      price: property.price,
      location: `${property.city}, ${property.state}`,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area_sqft,
      type: property.property_type as 'sale' | 'rent',
      image: property.images?.[0] || fallbackImage,
      description: property.description,
      amenities: property.amenities
    }

    if (isInComparison(property.id)) {
      removeFromComparison(property.id)
    } else {
      if (comparisonList.length >= maxComparisons) {
        alert(`You can only compare up to ${maxComparisons} properties at once.`)
        return
      }
      addToComparison(compProperty)
    }
  }

  return (
    <div className="card group hover:scale-[1.02] hover:shadow-2xl transition-all duration-500">
      {/* Elegant Image Carousel */}
      <div className="relative h-72 overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <>
            <Image
              src={imageError ? fallbackImage : (property.images[currentImageIndex] || fallbackImage)}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              onError={() => setImageError(true)}
            />

            {/* Sophisticated Image Navigation */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-slate-900/70 text-amber-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-amber-400 hover:text-slate-900"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-slate-900/70 text-amber-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-amber-400 hover:text-slate-900"
                >
                  →
                </button>

                {/* Elegant Image Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {property.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex ? 'bg-amber-400 w-6' : 'bg-amber-50/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center">
            <span className="text-slate-400">No Image Available</span>
          </div>
        )}

        {/* Refined Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-sm ${
            property.property_type === 'sale'
              ? 'bg-emerald-100/90 text-emerald-800 border border-emerald-200'
              : 'bg-blue-100/90 text-blue-800 border border-blue-200'
          }`}>
            For {property.property_type === 'sale' ? 'Sale' : 'Rent'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={handleFavoriteClick}
            className={`favorite-button p-2 rounded-full backdrop-blur-sm transition-all duration-200 shadow-lg ${
              isFavorite(property.id)
                ? 'bg-red-500 text-white'
                : 'bg-amber-50/90 text-slate-600 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite(property.id) ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleComparisonClick}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 shadow-lg ${
              isInComparison(property.id)
                ? 'bg-blue-500 text-white'
                : 'bg-amber-50/90 text-slate-600 hover:bg-blue-500 hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sophisticated Property Details */}
      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-slate-900 line-clamp-2 group-hover:text-amber-600 transition-colors duration-300">
            {property.title}
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-900">
              {formatPrice(property.price)}
            </div>
            {property.property_type === 'rent' && (
              <span className="text-sm text-slate-500 font-medium">/month</span>
            )}
          </div>
        </div>

        {/* Elegant Location */}
        <div className="flex items-center text-slate-600 mb-6">
          <MapPin className="w-4 h-4 mr-2 text-amber-500" />
          <span className="text-sm font-medium">{property.city}, {property.state}</span>
        </div>

        {/* Refined Property Features */}
        <div className="flex items-center justify-between mb-6 p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center text-slate-700">
            <Bed className="w-4 h-4 mr-2 text-amber-500" />
            <span className="text-sm font-medium">{property.bedrooms} bed</span>
          </div>
          <div className="flex items-center text-slate-700">
            <Bath className="w-4 h-4 mr-2 text-amber-500" />
            <span className="text-sm font-medium">{property.bathrooms} bath</span>
          </div>
          <div className="flex items-center text-slate-700">
            <Square className="w-4 h-4 mr-2 text-amber-500" />
            <span className="text-sm font-medium">{property.area_sqft.toLocaleString()} sqft</span>
          </div>
        </div>



        {/* Elegant Description */}
        <p className="text-slate-600 text-sm line-clamp-2 mb-6 leading-relaxed">
          {property.description}
        </p>

        {/* Sophisticated View Details Button */}
        <Link
          href={`/properties/${property.id}`}
          className="block w-full text-center btn-primary group-hover:bg-amber-400 group-hover:text-slate-900 transition-all duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}
