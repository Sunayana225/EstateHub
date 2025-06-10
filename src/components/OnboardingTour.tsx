'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useTour } from '@/contexts/TourContext'
import { X, ChevronLeft, ChevronRight, SkipForward, CheckCircle } from 'lucide-react'

interface Position {
  top: number
  left: number
  width: number
  height: number
}

export default function OnboardingTour() {
  const {
    activeTour,
    currentStepIndex,
    isActive,
    nextStep,
    previousStep,
    skipTour,
    completeTour
  } = useTour()

  const [targetPosition, setTargetPosition] = useState<Position | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const currentStep = activeTour?.steps[currentStepIndex]

  // Calculate target element position and tooltip placement
  useEffect(() => {
    if (!isActive || !currentStep) return

    const updatePositions = () => {
      const targetElement = document.querySelector(currentStep.target)
      
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

        const position: Position = {
          top: rect.top + scrollTop,
          left: rect.left + scrollLeft,
          width: rect.width,
          height: rect.height
        }

        setTargetPosition(position)

        // Calculate tooltip position based on step position preference
        const tooltipWidth = 320
        const tooltipHeight = 200
        const margin = 20

        let tooltipTop = position.top
        let tooltipLeft = position.left

        switch (currentStep.position) {
          case 'top':
            tooltipTop = position.top - tooltipHeight - margin
            tooltipLeft = position.left + (position.width / 2) - (tooltipWidth / 2)
            break
          case 'bottom':
            tooltipTop = position.top + position.height + margin
            tooltipLeft = position.left + (position.width / 2) - (tooltipWidth / 2)
            break
          case 'left':
            tooltipTop = position.top + (position.height / 2) - (tooltipHeight / 2)
            tooltipLeft = position.left - tooltipWidth - margin
            break
          case 'right':
            tooltipTop = position.top + (position.height / 2) - (tooltipHeight / 2)
            tooltipLeft = position.left + position.width + margin
            break
          case 'center':
            tooltipTop = window.innerHeight / 2 - tooltipHeight / 2 + scrollTop
            tooltipLeft = window.innerWidth / 2 - tooltipWidth / 2 + scrollLeft
            break
        }

        // Ensure tooltip stays within viewport
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        if (tooltipLeft < margin) tooltipLeft = margin
        if (tooltipLeft + tooltipWidth > viewportWidth - margin) {
          tooltipLeft = viewportWidth - tooltipWidth - margin
        }
        if (tooltipTop < margin + scrollTop) tooltipTop = margin + scrollTop
        if (tooltipTop + tooltipHeight > viewportHeight + scrollTop - margin) {
          tooltipTop = viewportHeight + scrollTop - tooltipHeight - margin
        }

        setTooltipPosition({ top: tooltipTop, left: tooltipLeft })

        // Scroll target into view if needed
        if (currentStep.position !== 'center') {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          })
        }
      } else if (currentStep.target === 'body') {
        // For center-positioned steps without specific targets
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
        
        setTargetPosition(null)
        setTooltipPosition({
          top: window.innerHeight / 2 - 100 + scrollTop,
          left: window.innerWidth / 2 - 160 + scrollLeft
        })
      }
    }

    updatePositions()
    
    // Update positions on scroll and resize
    window.addEventListener('scroll', updatePositions)
    window.addEventListener('resize', updatePositions)

    return () => {
      window.removeEventListener('scroll', updatePositions)
      window.removeEventListener('resize', updatePositions)
    }
  }, [isActive, currentStep])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isActive) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          skipTour()
          break
        case 'ArrowRight':
        case 'Enter':
          e.preventDefault()
          nextStep()
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (currentStepIndex > 0) {
            previousStep()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isActive, currentStepIndex, nextStep, previousStep, skipTour])

  if (!isActive || !activeTour || !currentStep) return null

  const progress = ((currentStepIndex + 1) / activeTour.steps.length) * 100
  const isLastStep = currentStepIndex === activeTour.steps.length - 1

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 pointer-events-none"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      >
        {/* Spotlight effect for target element */}
        {targetPosition && (
          <div
            className="absolute border-4 border-amber-400 rounded-lg shadow-2xl pointer-events-auto"
            style={{
              top: targetPosition.top - 4,
              left: targetPosition.left - 4,
              width: targetPosition.width + 8,
              height: targetPosition.height + 8,
              boxShadow: `
                0 0 0 4px rgba(251, 191, 36, 0.3),
                0 0 0 9999px rgba(0, 0, 0, 0.7)
              `,
              zIndex: 51
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      {tooltipPosition && (
        <div
          ref={tooltipRef}
          className="fixed z-52 pointer-events-auto"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            width: '320px'
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span className="text-sm font-medium">
                    {activeTour.name}
                  </span>
                </div>
                <button
                  onClick={skipTour}
                  className="text-slate-300 hover:text-white transition-colors"
                  aria-label="Close tour"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span>Step {currentStepIndex + 1} of {activeTour.steps.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-1.5">
                  <div
                    className="bg-amber-400 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {currentStep.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {currentStep.content}
              </p>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {currentStepIndex > 0 && (
                    <button
                      onClick={previousStep}
                      className="flex items-center space-x-1 px-3 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="text-sm">Back</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={skipTour}
                    className="flex items-center space-x-1 px-3 py-2 text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    <SkipForward className="w-4 h-4" />
                    <span className="text-sm">Skip Tour</span>
                  </button>
                  
                  <button
                    onClick={isLastStep ? completeTour : nextStep}
                    className="flex items-center space-x-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                  >
                    {isLastStep ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Finish</span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm font-medium">Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow pointing to target */}
          {targetPosition && currentStep.position !== 'center' && (
            <div
              className={`absolute w-0 h-0 ${
                currentStep.position === 'top' ? 'border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white -bottom-2 left-1/2 transform -translate-x-1/2' :
                currentStep.position === 'bottom' ? 'border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white -top-2 left-1/2 transform -translate-x-1/2' :
                currentStep.position === 'left' ? 'border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white -right-2 top-1/2 transform -translate-y-1/2' :
                'border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white -left-2 top-1/2 transform -translate-y-1/2'
              }`}
            />
          )}
        </div>
      )}
    </>
  )
}
