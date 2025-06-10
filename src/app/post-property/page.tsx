'use client'

import { useState } from 'react'
import { Upload, X, MapPin, DollarSign, Home, Image as ImageIcon, User, Phone, Mail, Building, Clock, Star } from 'lucide-react'

export default function PostPropertyPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    property_type: 'sale',
    bedrooms: '',
    bathrooms: '',
    area_sqft: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    amenities: [] as string[],
    // Contact Information
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    contact_whatsapp: '',
    contact_type: 'owner', // owner, agent, broker
    company_name: '',
    license_number: '',
    preferred_contact_method: 'phone',
    available_hours: 'business', // business, anytime, custom
    custom_hours: '',
    show_contact_immediately: true,
    additional_notes: '',
  })

  const [images, setImages] = useState<File[]>([])
  const [amenityInput, setAmenityInput] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files)
      processFiles(newImages)
    }
  }

  const processFiles = (files: File[]) => {
    // Filter only image files
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    const rejectedFiles = files.length - imageFiles.length

    if (rejectedFiles > 0) {
      alert(`${rejectedFiles} file(s) were rejected. Only image files are allowed!`)
    }

    const currentCount = images.length
    const availableSlots = 10 - currentCount
    const filesToAdd = imageFiles.slice(0, availableSlots)

    if (imageFiles.length > availableSlots) {
      alert(`Only ${availableSlots} more image(s) can be added. Maximum is 10 images.`)
    }

    if (filesToAdd.length > 0) {
      setImages(prev => [...prev, ...filesToAdd])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (images.length < 10) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    if (images.length >= 10) {
      alert('Maximum of 10 images allowed!')
      return
    }

    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const addAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()]
      }))
      setAmenityInput('')
    }
  }

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('Form data:', formData)
    console.log('Images:', images)
    alert('Property listing submitted successfully!')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Elegant Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-amber-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-light mb-4">
              List Your <span className="font-bold text-amber-400">Property</span>
            </h1>
            <div className="w-24 h-1 bg-amber-400 mx-auto mb-6"></div>
            <p className="text-xl text-amber-50/90 max-w-3xl mx-auto">
              Showcase your property to thousands of potential buyers and renters with our premium listing platform
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Contact Information - Most Important Section */}
          <div className="contact-info card p-8 border-l-4 border-amber-400">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center">
              <User className="w-6 h-6 mr-3 text-amber-600" />
              Contact Information
              <span className="ml-2 text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded-full font-medium">Required</span>
            </h2>
            <p className="text-slate-600 mb-6">
              This information will be displayed to potential buyers/renters so they can contact you directly.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="contact_name"
                  value={formData.contact_name}
                  onChange={handleInputChange}
                  placeholder="John Smith"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contact Type *
                </label>
                <select
                  name="contact_type"
                  value={formData.contact_type}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="owner">Property Owner</option>
                  <option value="agent">Real Estate Agent</option>
                  <option value="broker">Broker</option>
                  <option value="property_manager">Property Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  WhatsApp Number
                  <span className="text-slate-500 text-xs ml-1">(optional)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="contact_whatsapp"
                    value={formData.contact_whatsapp}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Preferred Contact Method *
                </label>
                <select
                  name="preferred_contact_method"
                  value={formData.preferred_contact_method}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="phone">Phone Call</option>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="any">Any Method</option>
                </select>
              </div>

              {(formData.contact_type === 'agent' || formData.contact_type === 'broker') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Company/Agency Name
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleInputChange}
                        placeholder="ABC Real Estate"
                        className="input-field pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      License Number
                    </label>
                    <input
                      type="text"
                      name="license_number"
                      value={formData.license_number}
                      onChange={handleInputChange}
                      placeholder="RE123456789"
                      className="input-field"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Available Hours *
                </label>
                <select
                  name="available_hours"
                  value={formData.available_hours}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="business">Business Hours (9 AM - 6 PM)</option>
                  <option value="extended">Extended Hours (8 AM - 8 PM)</option>
                  <option value="anytime">Anytime</option>
                  <option value="custom">Custom Hours</option>
                </select>
              </div>

              {formData.available_hours === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Custom Available Hours
                  </label>
                  <input
                    type="text"
                    name="custom_hours"
                    value={formData.custom_hours}
                    onChange={handleInputChange}
                    placeholder="Mon-Fri: 10 AM - 7 PM, Weekends: 12 PM - 5 PM"
                    className="input-field"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="show_contact_immediately"
                    name="show_contact_immediately"
                    checked={formData.show_contact_immediately}
                    onChange={(e) => setFormData(prev => ({ ...prev, show_contact_immediately: e.target.checked }))}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded"
                  />
                  <label htmlFor="show_contact_immediately" className="ml-2 block text-sm text-slate-700">
                    Show my contact information immediately to interested buyers
                    <span className="block text-xs text-slate-500">
                      If unchecked, buyers will need to request your contact information
                    </span>
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Contact Notes
                  <span className="text-slate-500 text-xs ml-1">(optional)</span>
                </label>
                <textarea
                  name="additional_notes"
                  value={formData.additional_notes}
                  onChange={handleInputChange}
                  placeholder="Best time to call, special instructions, etc."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
            </div>
          </div>
          {/* Basic Information */}
          <div className="property-form card p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center">
              <Home className="w-6 h-6 mr-3 text-amber-600" />
              Property Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Modern Downtown Apartment"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <select
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price * {formData.property_type === 'rent' && '(per month)'}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms *
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms *
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.5"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area (sq ft) *
                </label>
                <input
                  type="number"
                  name="area_sqft"
                  value={formData.area_sqft}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="input-field"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your property, its features, and what makes it special..."
                  rows={4}
                  className="input-field resize-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="card p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center">
              <MapPin className="w-6 h-6 mr-3 text-amber-600" />
              Property Location
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="New York"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="NY"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleInputChange}
                  placeholder="10001"
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="photo-upload card p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center">
              <ImageIcon className="w-6 h-6 mr-3 text-amber-600" />
              Property Images
              <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">Recommended</span>
            </h2>
            <p className="text-slate-600 mb-6">
              High-quality images significantly increase interest in your property. Upload up to 10 images.
            </p>

            <div className="space-y-6">
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  images.length >= 10
                    ? 'border-slate-300 bg-slate-50 opacity-60 cursor-not-allowed'
                    : isDragOver
                      ? 'border-amber-500 bg-amber-50 scale-105'
                      : 'border-amber-300 hover:border-amber-400'
                }`}
                onDragOver={images.length < 10 ? handleDragOver : undefined}
                onDragLeave={images.length < 10 ? handleDragLeave : undefined}
                onDrop={images.length < 10 ? handleDrop : undefined}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={images.length >= 10}
                />
                <label
                  htmlFor="image-upload"
                  className={`block ${images.length >= 10 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <Upload className={`w-16 h-16 mx-auto mb-4 transition-colors duration-300 ${
                    images.length >= 10
                      ? 'text-slate-400'
                      : isDragOver
                        ? 'text-amber-600'
                        : 'text-amber-500'
                  }`} />
                  <p className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                    images.length >= 10
                      ? 'text-slate-500'
                      : isDragOver
                        ? 'text-amber-900'
                        : 'text-slate-900'
                  }`}>
                    {images.length >= 10
                      ? 'Maximum Images Reached'
                      : isDragOver
                        ? 'Drop images here!'
                        : 'Upload Property Images'
                    }
                  </p>
                  <p className={`mb-4 transition-colors duration-300 ${
                    images.length >= 10
                      ? 'text-slate-500'
                      : isDragOver
                        ? 'text-amber-700'
                        : 'text-slate-600'
                  }`}>
                    {images.length >= 10
                      ? 'Remove some images to add more'
                      : isDragOver
                        ? 'Release to upload images'
                        : 'Drag and drop or click to select images (max 10)'
                    }
                  </p>
                  <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                    images.length >= 10
                      ? 'bg-slate-200 text-slate-600'
                      : isDragOver
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-amber-100 text-amber-800'
                  }`}>
                    <Star className="w-4 h-4 mr-2" />
                    Pro Tip: Include exterior, interior, and key feature photos
                  </div>
                </label>
              </div>

              {images.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Uploaded Images ({images.length}/10)
                    </h3>
                    {images.length >= 10 && (
                      <span className="text-sm text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                        Maximum reached
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Property ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-slate-200 group-hover:border-amber-300 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div className="card p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center">
              <Star className="w-6 h-6 mr-3 text-amber-600" />
              Amenities & Features
            </h2>
            <p className="text-slate-600 mb-6">
              Highlight the special features and amenities that make your property stand out.
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  placeholder="Add an amenity (e.g., Pool, Gym, Parking)"
                  className="flex-1 input-field"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  className="btn-primary"
                >
                  Add
                </button>
              </div>

              {formData.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(amenity)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Contact Preview */}
          {formData.contact_name && formData.contact_email && formData.contact_phone && (
            <div className="card p-8 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-amber-600" />
                Contact Information Preview
              </h3>
              <p className="text-slate-600 mb-4">This is how your contact information will appear to potential buyers:</p>

              <div className="bg-white rounded-lg p-6 border border-amber-200">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{formData.contact_name}</h4>
                    <p className="text-sm text-slate-600 capitalize mb-2">{formData.contact_type.replace('_', ' ')}</p>
                    {formData.company_name && (
                      <p className="text-sm text-slate-600 mb-2">{formData.company_name}</p>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-slate-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {formData.contact_phone}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {formData.contact_email}
                      </div>
                      {formData.contact_whatsapp && (
                        <div className="flex items-center text-sm text-slate-600">
                          <Phone className="w-4 h-4 mr-2" />
                          WhatsApp: {formData.contact_whatsapp}
                        </div>
                      )}
                      <div className="flex items-center text-sm text-slate-600">
                        <Clock className="w-4 h-4 mr-2" />
                        Available: {formData.available_hours === 'custom' ? formData.custom_hours : formData.available_hours.replace('_', ' ')}
                      </div>
                    </div>
                    {formData.additional_notes && (
                      <p className="text-sm text-slate-600 mt-2 italic">&ldquo;{formData.additional_notes}&rdquo;</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-lg">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Ready to List Your Property?</h3>
              <p className="text-slate-600">Review your information and publish your listing to reach thousands of potential buyers.</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button type="button" className="btn-secondary px-8 py-3 text-lg">
                Save as Draft
              </button>
              <button type="submit" className="btn-primary px-8 py-3 text-lg">
                Publish Property Listing
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                By publishing, you agree to our terms of service and privacy policy.
                Your contact information will be visible to interested buyers.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
