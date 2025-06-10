'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Home, Search, PlusCircle, BarChart3, User, Menu, X, LogOut, ChevronDown, Heart, Scale } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useComparison } from '@/contexts/ComparisonContext'
import AuthModal from './AuthModal'
import PropertyComparison from './PropertyComparison'


export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isFavoritesDropdownOpen, setIsFavoritesDropdownOpen] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const { user, logout } = useAuth()
  const { favorites } = useFavorites()
  const { comparisonList } = useComparison()
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const favoritesDropdownRef = useRef<HTMLDivElement>(null)

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/properties', label: 'Properties', icon: Search },
    { href: '/post-property', label: 'Post Property', icon: PlusCircle },
    { href: '/market-analytics', label: 'Market Analytics', icon: BarChart3 },
  ]



  const handleLogout = async () => {
    await logout()
    setIsMenuOpen(false)
    setIsProfileDropdownOpen(false)
    setIsFavoritesDropdownOpen(false)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
      if (favoritesDropdownRef.current && !favoritesDropdownRef.current.contains(event.target as Node)) {
        setIsFavoritesDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center h-16">
          {/* Logo - Positioned to the left */}
          <div className="flex-shrink-0 mr-8">
            <Link href="/" className="group flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Home className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-xl font-semibold text-slate-900">EstateHub</span>
            </Link>
          </div>

          {/* Centered Navigation */}
          <div className="flex-1 flex justify-center">
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200"
                    data-tour-target={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-2">
              {user ? (
                <div className="flex items-center space-x-2">
                  {/* Comparison Button */}
                  {comparisonList.length > 0 && (
                    <button
                      onClick={() => setShowComparison(true)}
                      className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      <div className="relative">
                        <Scale className="w-4 h-4" />
                        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          {comparisonList.length}
                        </span>
                      </div>
                      <span className="text-sm font-medium hidden lg:block">Compare</span>
                    </button>
                  )}

                  {/* Favorites Button */}
                  <div className="relative" ref={favoritesDropdownRef}>
                    <button
                      onClick={() => setIsFavoritesDropdownOpen(!isFavoritesDropdownOpen)}
                      className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <div className="relative">
                        <Heart className="w-4 h-4" />
                        {favorites.length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {favorites.length}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium hidden lg:block">Favorites</span>
                    </button>

                    {/* Favorites Dropdown */}
                    {isFavoritesDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 max-h-96 overflow-y-auto">
                        <div className="px-4 py-3 border-b border-slate-200">
                          <h3 className="font-semibold text-slate-900">My Favorites ({favorites.length})</h3>
                        </div>

                        {favorites.length === 0 ? (
                          <div className="px-4 py-6 text-center">
                            <Heart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-slate-500 text-sm">No favorites yet</p>
                          </div>
                        ) : (
                          <div className="max-h-64 overflow-y-auto">
                            {favorites.slice(0, 5).map((property) => (
                              <div key={property.id} className="px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-b-0">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={property.image}
                                    alt={property.title}
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-slate-900 truncate">
                                      {property.title}
                                    </h4>
                                    <p className="text-xs text-slate-500 truncate">{property.location}</p>
                                    <p className="text-sm font-semibold text-amber-600">
                                      ${property.price.toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {favorites.length > 5 && (
                              <div className="px-4 py-2 text-center border-t border-slate-200">
                                <span className="text-xs text-slate-500">
                                  +{favorites.length - 5} more properties
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="px-4 py-3 border-t border-slate-200">
                          <Link
                            href="/favorites"
                            onClick={() => setIsFavoritesDropdownOpen(false)}
                            className="block w-full text-center py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                          >
                            View All Favorites
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Profile Dropdown */}
                  <div className="relative" ref={profileDropdownRef}>
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="flex items-center space-x-2 p-2 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                    >
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-amber-600" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-slate-700 hidden lg:block">{user.name}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:text-amber-600 hover:bg-slate-50 transition-colors"
                        >
                          <BarChart3 className="w-4 h-4" />
                          <span className="font-medium">Dashboard</span>
                        </Link>
                        <Link
                          href="/post-property"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:text-amber-600 hover:bg-slate-50 transition-colors"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span className="font-medium">Post Property</span>
                        </Link>
                        <div className="border-t border-slate-200 my-2"></div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 bg-white">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 text-slate-700 hover:text-amber-600 hover:bg-slate-50 py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}

              {/* Mobile Comparison Button */}
              {comparisonList.length > 0 && (
                <button
                  onClick={() => {
                    setShowComparison(true)
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mx-4"
                >
                  <Scale className="w-5 h-5" />
                  <span className="font-medium">Compare ({comparisonList.length})</span>
                </button>
              )}

              {/* Mobile Auth Section */}
              <div className="pt-4 mt-4 border-t border-slate-200">
                {user ? (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3 px-4 py-2">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-amber-600" />
                        </div>
                      )}
                      <span className="font-medium text-slate-700">{user.name}</span>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 text-slate-700 hover:text-amber-600 hover:bg-slate-50 py-3 px-4 rounded-lg transition-colors"
                    >
                      <BarChart3 className="w-5 h-5" />
                      <span className="font-medium">Dashboard</span>
                    </Link>

                    <Link
                      href="/favorites"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 text-slate-700 hover:text-red-600 hover:bg-slate-50 py-3 px-4 rounded-lg transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      <span className="font-medium">Favorites ({favorites.length})</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 text-red-600 hover:text-red-700 hover:bg-red-50 py-3 px-4 rounded-lg transition-colors w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="px-4">
                    <button
                      onClick={() => {
                        setShowAuthModal(true)
                        setIsMenuOpen(false)
                      }}
                      className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors font-medium"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Property Comparison Modal */}
      <PropertyComparison
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
      />


    </nav>
  )
}
