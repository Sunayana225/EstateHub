'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Property } from './FavoritesContext'

interface ComparisonContextType {
  comparisonList: Property[]
  addToComparison: (property: Property) => void
  removeFromComparison: (propertyId: string) => void
  isInComparison: (propertyId: string) => boolean
  clearComparison: () => void
  maxComparisons: number
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined)

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [comparisonList, setComparisonList] = useState<Property[]>([])
  const maxComparisons = 3 // Maximum properties to compare

  // Load comparison list from localStorage on mount
  useEffect(() => {
    const savedComparison = localStorage.getItem('property-comparison')
    if (savedComparison) {
      try {
        setComparisonList(JSON.parse(savedComparison))
      } catch (error) {
        console.error('Error loading comparison list:', error)
      }
    }
  }, [])

  // Save comparison list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('property-comparison', JSON.stringify(comparisonList))
  }, [comparisonList])

  const addToComparison = (property: Property) => {
    setComparisonList(prev => {
      if (prev.some(item => item.id === property.id)) {
        return prev // Already in comparison
      }
      if (prev.length >= maxComparisons) {
        // Replace the first item if at max capacity
        return [property, ...prev.slice(0, maxComparisons - 1)]
      }
      return [...prev, property]
    })
  }

  const removeFromComparison = (propertyId: string) => {
    setComparisonList(prev => prev.filter(item => item.id !== propertyId))
  }

  const isInComparison = (propertyId: string) => {
    return comparisonList.some(item => item.id === propertyId)
  }

  const clearComparison = () => {
    setComparisonList([])
  }

  return (
    <ComparisonContext.Provider value={{
      comparisonList,
      addToComparison,
      removeFromComparison,
      isInComparison,
      clearComparison,
      maxComparisons
    }}>
      {children}
    </ComparisonContext.Provider>
  )
}

export function useComparison() {
  const context = useContext(ComparisonContext)
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider')
  }
  return context
}
