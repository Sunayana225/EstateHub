'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Property } from '@/lib/types'
import ScheduleTourModal from '@/components/ScheduleTourModal'
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  Share2,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  ArrowLeft,
  User
} from 'lucide-react'

// Mock property data - in real app, this would come from API
const mockProperty: Property = {
  id: '1',
  title: 'Modern Downtown Apartment with Stunning City Views',
  description: 'This beautiful 2-bedroom, 2-bathroom apartment offers the perfect blend of modern luxury and urban convenience. Located in the heart of downtown, you\'ll enjoy breathtaking city views from the floor-to-ceiling windows. The open-concept living space features high-end finishes, stainless steel appliances, and a spacious balcony perfect for entertaining. Building amenities include a fitness center, rooftop pool, and 24/7 concierge service.',
  price: 2500,
  property_type: 'rent',
  bedrooms: 2,
  bathrooms: 2,
  area_sqft: 1200,
  address: '123 Main Street, Unit 1205',
  city: 'New York',
  state: 'NY',
  zip_code: '10001',
  images: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=center'
  ],
  amenities: [
    'Gym/Fitness Center',
    'Swimming Pool',
    'Balcony/Terrace',
    'Parking Space',
    'Air Conditioning',
    'Dishwasher',
    'In-unit Laundry',
    '24/7 Concierge',
    'Pet Friendly',
    'High-speed Internet'
  ],
  status: 'active',
  user_id: 'user1',
  created_at: '2024-01-01',
  updated_at: '2024-01-01'
}

export default function PropertyDetailPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [showScheduleTour, setShowScheduleTour] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === mockProperty.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? mockProperty.images.length - 1 : prev - 1
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/properties" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Properties
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="card overflow-hidden">
              <div className="relative h-96">
                <Image
                  src={mockProperty.images[currentImageIndex] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&crop=center'}
                  alt={mockProperty.title}
                  fill
                  className="object-cover"
                />
                
                {/* Image Navigation */}
                {mockProperty.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                    >
                      →
                    </button>
                  </>
                )}

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="p-2 rounded-full bg-white/80 hover:bg-white"
                  >
                    <Heart 
                      className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                    />
                  </button>
                  <button className="p-2 rounded-full bg-white/80 hover:bg-white">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {mockProperty.images.length}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {mockProperty.images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {mockProperty.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Property ${index + 1}`}
                        width={80}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="card p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {mockProperty.title}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{mockProperty.address}, {mockProperty.city}, {mockProperty.state} {mockProperty.zip_code}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {formatPrice(mockProperty.price)}
                  </div>
                  {mockProperty.property_type === 'rent' && (
                    <span className="text-gray-500">/month</span>
                  )}
                </div>
              </div>

              {/* Property Features */}
              <div className="grid grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Bed className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{mockProperty.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center">
                  <Bath className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{mockProperty.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center">
                  <Square className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{mockProperty.area_sqft.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Sq Ft</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">{mockProperty.description}</p>
              </div>
            </div>

            {/* Amenities */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mockProperty.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Location</h2>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Interactive map would go here</p>
                  <p className="text-sm text-gray-400">Google Maps integration</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="card p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Agent</h3>
              
              <div className="space-y-4">
                <button
                  onClick={() => window.open('tel:+1234567890')}
                  className="w-full btn-primary flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </button>

                <button
                  onClick={() => setShowScheduleTour(true)}
                  className="w-full btn-secondary flex items-center justify-center"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Tour
                </button>
              </div>

              {/* Agent Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">John Smith</h4>
                    <p className="text-sm text-gray-600">Licensed Real Estate Agent</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>john.smith@realestate.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Status */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    Available
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed:</span>
                  <span className="text-gray-900">30 days ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Views:</span>
                  <span className="text-gray-900">245</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property ID:</span>
                  <span className="text-gray-900">#{mockProperty.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Tour Modal */}
      <ScheduleTourModal
        isOpen={showScheduleTour}
        onClose={() => setShowScheduleTour(false)}
        propertyTitle={mockProperty.title}
      />
    </div>
  )
}
