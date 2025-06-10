'use client'

import { X, Scale, Bed, Bath, Square, MapPin, Star, DollarSign } from 'lucide-react'
import { useComparison } from '@/contexts/ComparisonContext'

interface PropertyComparisonProps {
  isOpen: boolean
  onClose: () => void
}

export default function PropertyComparison({ isOpen, onClose }: PropertyComparisonProps) {
  const { comparisonList, removeFromComparison, clearComparison } = useComparison()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <Scale className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-slate-900">
              Property Comparison ({comparisonList.length})
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            {comparisonList.length > 0 && (
              <button
                onClick={clearComparison}
                className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors font-medium"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-50 rounded-full transition-all duration-200 group border border-slate-200 hover:border-red-200 shadow-sm hover:shadow-md"
              title="Close comparison"
            >
              <X className="w-6 h-6 text-slate-600 group-hover:text-red-600 transition-colors" />
            </button>
          </div>
        </div>

        {comparisonList.length === 0 ? (
          <div className="p-12 text-center">
            <Scale className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Properties to Compare</h3>
            <p className="text-slate-600 mb-6">
              Add properties to comparison by clicking the scale icon on property cards.
            </p>

            {/* Close Button for Empty State */}
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="flex items-center space-x-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <X className="w-5 h-5" />
                <span>Close</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900 border-b border-slate-200">
                      Property Details
                    </td>
                    {comparisonList.map((property) => (
                      <td key={property.id} className="p-4 border-b border-slate-200 min-w-[300px]">
                        <div className="relative">
                          <button
                            onClick={() => removeFromComparison(property.id)}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 z-20 shadow-lg hover:shadow-xl hover:scale-110 border-2 border-white"
                            title="Remove from comparison"
                          >
                            <X className="w-5 h-5" />
                          </button>
                          <img
                            src={property.image}
                            alt={property.title}
                            className="w-full h-48 object-cover rounded-lg mb-3"
                          />
                          <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">
                            {property.title}
                          </h3>
                          <div className="flex items-center text-slate-600 text-sm mb-3">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="line-clamp-1">{property.location}</span>
                          </div>
                          {/* Additional Remove Button */}
                          <button
                            onClick={() => removeFromComparison(property.id)}
                            className="w-full py-2 px-3 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors text-sm font-medium border border-red-200"
                          >
                            <X className="w-4 h-4 inline mr-1" />
                            Remove
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Price */}
                  <tr className="border-b border-slate-100">
                    <td className="p-4 font-medium text-slate-900 bg-slate-50">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                        Price
                      </div>
                    </td>
                    {comparisonList.map((property) => (
                      <td key={property.id} className="p-4">
                        <div className="text-xl font-bold text-green-600">
                          {formatPrice(property.price)}
                          {property.type === 'rent' && (
                            <span className="text-sm text-slate-500 font-normal">/month</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Property Type */}
                  <tr className="border-b border-slate-100">
                    <td className="p-4 font-medium text-slate-900 bg-slate-50">Type</td>
                    {comparisonList.map((property) => (
                      <td key={property.id} className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          property.type === 'sale' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          For {property.type === 'sale' ? 'Sale' : 'Rent'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Bedrooms */}
                  <tr className="border-b border-slate-100">
                    <td className="p-4 font-medium text-slate-900 bg-slate-50">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-2 text-blue-600" />
                        Bedrooms
                      </div>
                    </td>
                    {comparisonList.map((property) => (
                      <td key={property.id} className="p-4">
                        <span className="text-lg font-semibold text-slate-900">
                          {property.bedrooms}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Bathrooms */}
                  <tr className="border-b border-slate-100">
                    <td className="p-4 font-medium text-slate-900 bg-slate-50">
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-2 text-blue-600" />
                        Bathrooms
                      </div>
                    </td>
                    {comparisonList.map((property) => (
                      <td key={property.id} className="p-4">
                        <span className="text-lg font-semibold text-slate-900">
                          {property.bathrooms}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Area */}
                  <tr className="border-b border-slate-100">
                    <td className="p-4 font-medium text-slate-900 bg-slate-50">
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-2 text-purple-600" />
                        Area
                      </div>
                    </td>
                    {comparisonList.map((property) => (
                      <td key={property.id} className="p-4">
                        <span className="text-lg font-semibold text-slate-900">
                          {property.area.toLocaleString()} sq ft
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Price per sq ft */}
                  <tr className="border-b border-slate-100">
                    <td className="p-4 font-medium text-slate-900 bg-slate-50">Price per sq ft</td>
                    {comparisonList.map((property) => (
                      <td key={property.id} className="p-4">
                        <span className="text-lg font-semibold text-amber-600">
                          ${Math.round(property.price / property.area)}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  {comparisonList.some(p => p.rating) && (
                    <tr className="border-b border-slate-100">
                      <td className="p-4 font-medium text-slate-900 bg-slate-50">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-2 text-yellow-500" />
                          Rating
                        </div>
                      </td>
                      {comparisonList.map((property) => (
                        <td key={property.id} className="p-4">
                          {property.rating ? (
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                              <span className="text-lg font-semibold text-slate-900">
                                {property.rating.toFixed(1)}
                              </span>
                              {property.reviews && (
                                <span className="text-sm text-slate-500 ml-1">
                                  ({property.reviews})
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400">No rating</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  )}

                  {/* Amenities */}
                  {comparisonList.some(p => p.amenities && p.amenities.length > 0) && (
                    <tr className="border-b border-slate-100">
                      <td className="p-4 font-medium text-slate-900 bg-slate-50">Amenities</td>
                      {comparisonList.map((property) => (
                        <td key={property.id} className="p-4">
                          {property.amenities && property.amenities.length > 0 ? (
                            <div className="space-y-1">
                              {property.amenities.slice(0, 5).map((amenity, index) => (
                                <div key={index} className="text-sm text-slate-600">
                                  • {amenity}
                                </div>
                              ))}
                              {property.amenities.length > 5 && (
                                <div className="text-sm text-slate-500">
                                  +{property.amenities.length - 5} more
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400">No amenities listed</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Close Button */}
            <div className="flex justify-center pt-6 border-t border-slate-200 mt-6">
              <button
                onClick={onClose}
                className="flex items-center space-x-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <X className="w-5 h-5" />
                <span>Close Comparison</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
