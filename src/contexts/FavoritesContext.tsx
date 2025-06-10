'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Property {
  id: string
  title: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  type: 'sale' | 'rent'
  image: string
  description?: string
  amenities?: string[]
  rating?: number
  reviews?: number
}

interface FavoritesContextType {
  favorites: Property[]
  addToFavorites: (property: Property) => void
  removeFromFavorites: (propertyId: string) => void
  isFavorite: (propertyId: string) => boolean
  clearFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Property[]>([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('property-favorites')
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error('Error loading favorites:', error)
      }
    }
  }, [])

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('property-favorites', JSON.stringify(favorites))
  }, [favorites])

  const addToFavorites = (property: Property) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.id === property.id)) {
        return prev // Already in favorites
      }
      return [...prev, property]
    })
  }

  const removeFromFavorites = (propertyId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== propertyId))
  }

  const isFavorite = (propertyId: string) => {
    return favorites.some(fav => fav.id === propertyId)
  }

  const clearFavorites = () => {
    setFavorites([])
  }

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      clearFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
