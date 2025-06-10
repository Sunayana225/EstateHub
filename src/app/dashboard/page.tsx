'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Property } from '@/lib/types'
import { Eye, Edit, Trash2, Plus, Home, Users, TrendingUp, LogIn } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/AuthModal'

// Mock user properties
const mockUserProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    description: 'Beautiful 2-bedroom apartment in the heart of downtown',
    price: 2500,
    property_type: 'rent',
    bedrooms: 2,
    bathrooms: 2,
    area_sqft: 1200,
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip_code: '10001',
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&crop=center'],
    amenities: ['Gym', 'Pool', 'Parking'],
    status: 'active',
    user_id: 'user1',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: '2',
    title: 'Luxury Family Home',
    description: 'Spacious 4-bedroom family home with large backyard',
    price: 750000,
    property_type: 'sale',
    bedrooms: 4,
    bathrooms: 3,
    area_sqft: 2800,
    address: '456 Oak Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zip_code: '90210',
    images: ['/placeholder-property.jpg'],
    amenities: ['Garden', 'Garage', 'Fireplace'],
    status: 'pending',
    user_id: 'user1',
    created_at: '2024-01-02',
    updated_at: '2024-01-02'
  }
]

export default function DashboardPage() {
  const [properties] = useState<Property[]>(mockUserProperties)
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'analytics'>('overview')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, isLoading } = useAuth()

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">
              Access Your Dashboard
            </h1>
            <p className="text-slate-600 mb-8">
              Please sign in to view your property dashboard, manage listings, and access analytics.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="btn-gold w-full py-3 text-lg font-semibold mb-4"
            >
              Sign In to Continue
            </button>
            <p className="text-sm text-slate-500">
              New to EstateHub?{' '}
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                Create an account
              </button>
            </p>
          </div>
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
        </div>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'sold':
        return 'bg-blue-100 text-blue-800'
      case 'rented':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = {
    totalProperties: properties.length,
    activeListings: properties.filter(p => p.status === 'active').length,
    totalViews: 1250,
    totalInquiries: 45
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Manage your properties and track performance</p>
            </div>
            
            <Link href="/post-property" className="mt-4 lg:mt-0 btn-primary">
              <Plus className="w-5 h-5 mr-2" />
              Add New Property
            </Link>
          </div>

          {/* Tabs */}
          <div className="mt-8 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'properties', label: 'My Properties' },
                { id: 'analytics', label: 'Analytics' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'properties' | 'analytics')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Properties</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalProperties}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Home className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Listings</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.activeListings}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalViews}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Inquiries</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalInquiries}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">New inquiry for Modern Downtown Apartment</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">New</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Property viewed 15 times today</p>
                    <p className="text-sm text-gray-500">5 hours ago</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Views</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">Luxury Family Home status updated to pending</p>
                    <p className="text-sm text-gray-500">1 day ago</p>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Update</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            {properties.length > 0 ? (
              <div className="grid gap-6">
                {properties.map((property) => (
                  <div key={property.id} className="card p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <h3 className="text-xl font-semibold text-gray-900">{property.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(property.status)}`}>
                            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Price:</span> {formatPrice(property.price)}
                            {property.property_type === 'rent' && '/month'}
                          </div>
                          <div>
                            <span className="font-medium">Type:</span> For {property.property_type === 'sale' ? 'Sale' : 'Rent'}
                          </div>
                          <div>
                            <span className="font-medium">Location:</span> {property.city}, {property.state}
                          </div>
                          <div>
                            <span className="font-medium">Bedrooms:</span> {property.bedrooms}
                          </div>
                          <div>
                            <span className="font-medium">Bathrooms:</span> {property.bathrooms}
                          </div>
                          <div>
                            <span className="font-medium">Area:</span> {property.area_sqft.toLocaleString()} sqft
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 lg:mt-0 flex gap-2">
                        <Link
                          href={`/properties/${property.id}`}
                          className="btn-secondary flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                        <button className="btn-secondary flex items-center">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button className="btn-secondary text-red-600 hover:bg-red-50 flex items-center">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties yet</h3>
                <p className="text-gray-600 mb-6">Start by adding your first property listing</p>
                <Link href="/post-property" className="btn-primary">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Property
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Performance</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Analytics charts would go here</p>
                  <p className="text-sm text-gray-400">Views, inquiries, and performance metrics</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
