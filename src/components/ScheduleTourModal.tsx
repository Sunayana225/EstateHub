'use client'

import { useState } from 'react'
import { X, Calendar, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react'

interface ScheduleTourModalProps {
  isOpen: boolean
  onClose: () => void
  propertyTitle?: string
}

export default function ScheduleTourModal({ isOpen, onClose, propertyTitle }: ScheduleTourModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    tourType: '',
    notes: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Here you would typically send the data to your backend
    console.log('Tour scheduled:', formData)
    
    // Show success message
    alert('Tour scheduled successfully! We will contact you shortly to confirm.')
    
    // Reset form and close modal
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      tourType: '',
      notes: ''
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Schedule a Tour</h3>
              {propertyTitle && (
                <p className="text-sm text-gray-600 mt-1">{propertyTitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="input-field"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="input-field"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="input-field"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Preferred Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Preferred Time *
              </label>
              <select 
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required 
                className="input-field"
              >
                <option value="">Select a time</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">1:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="17:00">5:00 PM</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tour Type *
              </label>
              <select 
                name="tourType"
                value={formData.tourType}
                onChange={handleInputChange}
                required 
                className="input-field"
              >
                <option value="">Select tour type</option>
                <option value="in-person">In-Person Tour</option>
                <option value="virtual">Virtual Tour</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="w-4 h-4 inline mr-1" />
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="input-field resize-none"
                rows={3}
                placeholder="Any specific requirements or questions?"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary"
              >
                Schedule Tour
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
