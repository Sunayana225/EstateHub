'use client'

import { useState, useEffect } from 'react'
import { useTour } from '@/contexts/TourContext'

import { 
  Compass, 
  X, 
  Play, 
  CheckCircle, 
  Clock, 
  Users, 
  Search, 
  PlusCircle, 
  BarChart3,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

export default function TourLauncher() {
  const [showLauncher, setShowLauncher] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const { 
    availableTours, 
    completedTours, 
    startTour, 
    showWelcomeTour, 
    setShowWelcomeTour 
  } = useTour()

  useEffect(() => {
    // Show welcome tour for new users
    if (showWelcomeTour && !completedTours.includes('welcome')) {
      const timer = setTimeout(() => {
        setShowLauncher(true)
        setIsExpanded(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [showWelcomeTour, completedTours])

  const handleStartWelcomeTour = () => {
    startTour('welcome')
    setShowLauncher(false)
    setIsExpanded(false)
  }

  const handleStartTour = (tourId: string) => {
    startTour(tourId)
    setShowLauncher(false)
    setIsExpanded(false)
  }

  const dismissWelcome = () => {
    setShowWelcomeTour(false)
    setShowLauncher(false)
    setIsExpanded(false)
  }

  const getTourIcon = (tourId: string) => {
    switch (tourId) {
      case 'welcome':
        return <Compass className="w-4 h-4" />
      case 'property-search':
        return <Search className="w-4 h-4" />
      case 'post-property':
        return <PlusCircle className="w-4 h-4" />
      case 'market-analytics':
        return <BarChart3 className="w-4 h-4" />
      default:
        return <Play className="w-4 h-4" />
    }
  }

  const getTourDuration = (tourId: string) => {
    const tour = availableTours.find(t => t.id === tourId)
    if (!tour) return '2 min'
    
    // Estimate 30 seconds per step
    const minutes = Math.ceil((tour.steps.length * 30) / 60)
    return `${minutes} min`
  }

  const isWelcomeUser = showWelcomeTour && !completedTours.includes('welcome')

  if (!showLauncher && !isWelcomeUser) {
    return (
      <button
        onClick={() => setShowLauncher(true)}
        className="fixed bottom-6 right-6 z-40 bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        aria-label="Open tour guide"
      >
        <Compass className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <span className="font-semibold">
                {isWelcomeUser ? 'Welcome to EstateHub!' : 'Guided Tours'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {!isWelcomeUser && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}
              <button
                onClick={isWelcomeUser ? dismissWelcome : () => setShowLauncher(false)}
                className="text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {isWelcomeUser ? (
            // Welcome message for new users
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-amber-600">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">New User</span>
              </div>
              
              <p className="text-slate-600 text-sm leading-relaxed">
                Welcome to EstateHub! We&apos;ve prepared a quick tour to help you get started with our platform.
                It will only take a few minutes.
              </p>

              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                <span>Takes about 3 minutes</span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleStartWelcomeTour}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                >
                  Start Tour
                </button>
                <button
                  onClick={dismissWelcome}
                  className="px-4 py-2 text-slate-500 hover:text-slate-700 transition-colors text-sm"
                >
                  Skip
                </button>
              </div>
            </div>
          ) : (
            // Tour selection for returning users
            <div className="space-y-3">
              <p className="text-slate-600 text-sm">
                Choose a guided tour to learn about specific features:
              </p>

              {isExpanded && (
                <div className="space-y-2">
                  {availableTours.map((tour) => {
                    const isCompleted = completedTours.includes(tour.id)
                    
                    return (
                      <div
                        key={tour.id}
                        className={`border rounded-lg p-3 transition-all ${
                          isCompleted 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-slate-200 hover:border-amber-300 hover:bg-amber-50 cursor-pointer'
                        }`}
                        onClick={() => !isCompleted && handleStartTour(tour.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-1.5 rounded-lg ${
                              isCompleted 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                getTourIcon(tour.id)
                              )}
                            </div>
                            <div>
                              <h4 className={`text-sm font-medium ${
                                isCompleted ? 'text-green-800' : 'text-slate-900'
                              }`}>
                                {tour.name}
                              </h4>
                              <p className={`text-xs ${
                                isCompleted ? 'text-green-600' : 'text-slate-500'
                              }`}>
                                {tour.description}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1 text-xs text-slate-400">
                              <Clock className="w-3 h-3" />
                              <span>{getTourDuration(tour.id)}</span>
                            </div>
                            {isCompleted && (
                              <span className="text-xs text-green-600 font-medium">
                                Completed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {!isExpanded && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="w-full text-center py-2 text-amber-600 hover:text-amber-700 transition-colors text-sm font-medium"
                >
                  View All Tours ({availableTours.length})
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer for returning users */}
        {!isWelcomeUser && (
          <div className="border-t border-slate-200 px-4 py-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                {completedTours.length} of {availableTours.length} completed
              </span>
              <button
                onClick={() => setShowLauncher(false)}
                className="text-amber-600 hover:text-amber-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
