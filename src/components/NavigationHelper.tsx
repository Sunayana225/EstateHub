'use client'

import { useState, useEffect } from 'react'
import { X, Lightbulb } from 'lucide-react'

export default function NavigationHelper() {
  const [showHelper, setShowHelper] = useState(false)

  useEffect(() => {
    // Check if user has seen the navigation helper before
    const hasSeenHelper = localStorage.getItem('hasSeenNavHelper')
    
    if (!hasSeenHelper) {
      // Show helper after a short delay
      const timer = setTimeout(() => {
        setShowHelper(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [])

  const dismissHelper = () => {
    setShowHelper(false)
    localStorage.setItem('hasSeenNavHelper', 'true')
  }

  if (!showHelper) return null

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl max-w-sm mx-4">
        <div className="flex items-start space-x-3">
          <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">Quick Navigation Guide</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              🏠 <strong>Home</strong> - Main page<br/>
              🔍 <strong>Properties</strong> - Browse listings<br/>
              ➕ <strong>Post Property</strong> - Add your listing<br/>
              📊 <strong>Market Analytics</strong> - View trends
            </p>
          </div>
          <button
            onClick={dismissHelper}
            className="text-slate-400 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mt-3 pt-3 border-t border-slate-700">
          <button
            onClick={dismissHelper}
            className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium"
          >
            Got it, don&apos;t show again
          </button>
        </div>
      </div>
    </div>
  )
}
