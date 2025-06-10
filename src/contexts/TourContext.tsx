'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface TourStep {
  id: string
  title: string
  content: string
  target: string // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right' | 'center'
  page?: string // Optional: specific page this step belongs to
  action?: 'click' | 'hover' | 'none'
  nextAction?: () => void // Optional: action to perform before going to next step
}

export interface Tour {
  id: string
  name: string
  description: string
  steps: TourStep[]
  category: 'welcome' | 'feature' | 'advanced'
}

interface TourContextType {
  // Current tour state
  activeTour: Tour | null
  currentStepIndex: number
  isActive: boolean
  
  // Tour management
  startTour: (tourId: string) => void
  nextStep: () => void
  previousStep: () => void
  skipTour: () => void
  completeTour: () => void
  
  // Tour data
  availableTours: Tour[]
  completedTours: string[]
  
  // Settings
  showWelcomeTour: boolean
  setShowWelcomeTour: (show: boolean) => void
  
  // Helper functions
  isStepCompleted: (tourId: string, stepId: string) => boolean
  markStepCompleted: (tourId: string, stepId: string) => void
  resetTourProgress: () => void
}

const TourContext = createContext<TourContextType | undefined>(undefined)

export function useTour() {
  const context = useContext(TourContext)
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider')
  }
  return context
}

interface TourProviderProps {
  children: ReactNode
}

export function TourProvider({ children }: TourProviderProps) {
  const [activeTour, setActiveTour] = useState<Tour | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [completedTours, setCompletedTours] = useState<string[]>([])
  const [completedSteps, setCompletedSteps] = useState<Record<string, string[]>>({})
  const [showWelcomeTour, setShowWelcomeTour] = useState(true)

  // Load saved progress from localStorage
  useEffect(() => {
    const savedCompletedTours = localStorage.getItem('completedTours')
    const savedCompletedSteps = localStorage.getItem('completedSteps')
    const savedShowWelcome = localStorage.getItem('showWelcomeTour')
    
    if (savedCompletedTours) {
      setCompletedTours(JSON.parse(savedCompletedTours))
    }
    
    if (savedCompletedSteps) {
      setCompletedSteps(JSON.parse(savedCompletedSteps))
    }
    
    if (savedShowWelcome !== null) {
      setShowWelcomeTour(JSON.parse(savedShowWelcome))
    }
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('completedTours', JSON.stringify(completedTours))
  }, [completedTours])

  useEffect(() => {
    localStorage.setItem('completedSteps', JSON.stringify(completedSteps))
  }, [completedSteps])

  useEffect(() => {
    localStorage.setItem('showWelcomeTour', JSON.stringify(showWelcomeTour))
  }, [showWelcomeTour])

  // Tour definitions
  const availableTours: Tour[] = [
    {
      id: 'welcome',
      name: 'Welcome to EstateHub',
      description: 'Get started with our platform',
      category: 'welcome',
      steps: [
        {
          id: 'welcome-1',
          title: 'Welcome to EstateHub!',
          content: 'Let\'s take a quick tour to help you get started with our premium real estate platform.',
          target: 'body',
          position: 'center'
        },
        {
          id: 'welcome-2',
          title: 'Navigation Menu',
          content: 'Use this navigation bar to access different sections of the platform.',
          target: 'nav',
          position: 'bottom'
        },
        {
          id: 'welcome-3',
          title: 'Browse Properties',
          content: 'Click here to search and browse available properties for rent or sale.',
          target: '[data-tour-target="nav-properties"]',
          position: 'bottom'
        },
        {
          id: 'welcome-4',
          title: 'Post Your Property',
          content: 'Have a property to list? Click here to post your property and reach potential buyers or tenants.',
          target: '[data-tour-target="nav-post-property"]',
          position: 'bottom'
        },
        {
          id: 'welcome-5',
          title: 'Market Analytics',
          content: 'Access real-time market data and trends to make informed decisions.',
          target: '[data-tour-target="nav-market-analytics"]',
          position: 'bottom'
        }
      ]
    },
    {
      id: 'property-search',
      name: 'Property Search Guide',
      description: 'Learn how to find your perfect property',
      category: 'feature',
      steps: [
        {
          id: 'search-1',
          title: 'Property Filters',
          content: 'Use these filters to narrow down properties by price, location, type, and amenities.',
          target: '.property-filters',
          position: 'right'
        },
        {
          id: 'search-2',
          title: 'Property Cards',
          content: 'Each card shows key property details. Click to view more information.',
          target: '.property-card:first-child',
          position: 'top'
        },
        {
          id: 'search-3',
          title: 'Favorites',
          content: 'Click the heart icon to save properties to your favorites list.',
          target: '.favorite-button',
          position: 'left'
        }
      ]
    },
    {
      id: 'post-property',
      name: 'Post Property Guide',
      description: 'Learn how to list your property',
      category: 'feature',
      steps: [
        {
          id: 'post-1',
          title: 'Property Details Form',
          content: 'Fill in your property details including title, description, and price.',
          target: '.property-form',
          position: 'right'
        },
        {
          id: 'post-2',
          title: 'Upload Photos',
          content: 'Add high-quality photos to showcase your property.',
          target: '.photo-upload',
          position: 'top'
        },
        {
          id: 'post-3',
          title: 'Contact Information',
          content: 'Provide your contact details so interested buyers can reach you.',
          target: '.contact-info',
          position: 'left'
        }
      ]
    },
    {
      id: 'market-analytics',
      name: 'Market Analytics Guide',
      description: 'Understand market trends and data',
      category: 'feature',
      steps: [
        {
          id: 'analytics-1',
          title: 'Market Overview',
          content: 'View overall market trends and key indicators for your selected region.',
          target: '.market-overview',
          position: 'bottom'
        },
        {
          id: 'analytics-2',
          title: 'Price Trends',
          content: 'Analyze price trends over different time periods using these interactive charts.',
          target: '.price-charts',
          position: 'top'
        },
        {
          id: 'analytics-3',
          title: 'Location Filters',
          content: 'Filter data by country, state, or city to get localized insights.',
          target: '.location-filters',
          position: 'right'
        }
      ]
    }
  ]

  const startTour = (tourId: string) => {
    const tour = availableTours.find(t => t.id === tourId)
    if (tour) {
      setActiveTour(tour)
      setCurrentStepIndex(0)
      setIsActive(true)
    }
  }

  const nextStep = () => {
    if (activeTour && currentStepIndex < activeTour.steps.length - 1) {
      const currentStep = activeTour.steps[currentStepIndex]
      markStepCompleted(activeTour.id, currentStep.id)
      
      if (currentStep.nextAction) {
        currentStep.nextAction()
      }
      
      setCurrentStepIndex(prev => prev + 1)
    } else {
      completeTour()
    }
  }

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }

  const skipTour = () => {
    setIsActive(false)
    setActiveTour(null)
    setCurrentStepIndex(0)
  }

  const completeTour = () => {
    if (activeTour) {
      setCompletedTours(prev => [...prev, activeTour.id])
      
      // Mark all steps as completed
      activeTour.steps.forEach(step => {
        markStepCompleted(activeTour.id, step.id)
      })
    }
    
    setIsActive(false)
    setActiveTour(null)
    setCurrentStepIndex(0)
  }

  const isStepCompleted = (tourId: string, stepId: string): boolean => {
    return completedSteps[tourId]?.includes(stepId) || false
  }

  const markStepCompleted = (tourId: string, stepId: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [tourId]: [...(prev[tourId] || []), stepId].filter((id, index, arr) => arr.indexOf(id) === index)
    }))
  }

  const resetTourProgress = () => {
    setCompletedTours([])
    setCompletedSteps({})
    setShowWelcomeTour(true)
    localStorage.removeItem('completedTours')
    localStorage.removeItem('completedSteps')
    localStorage.removeItem('showWelcomeTour')
  }

  const value: TourContextType = {
    activeTour,
    currentStepIndex,
    isActive,
    startTour,
    nextStep,
    previousStep,
    skipTour,
    completeTour,
    availableTours,
    completedTours,
    showWelcomeTour,
    setShowWelcomeTour,
    isStepCompleted,
    markStepCompleted,
    resetTourProgress
  }

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  )
}
