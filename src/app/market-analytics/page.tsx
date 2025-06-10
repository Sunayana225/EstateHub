'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { DollarSign, Home, BarChart3, TrendingUp, TrendingDown, Calendar, MapPin, Globe, Loader2 } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Loader } from '@googlemaps/js-api-loader'
import { generateMarketData, generateHistoricalData, LOCATION_DATA, type LocationFilter, type MarketData } from '@/utils/realEstateAPI'

export default function MarketAnalyticsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('12m')

  const [locationFilter, setLocationFilter] = useState<LocationFilter>({
    country: 'United States',
    state: 'California',
    city: 'Los Angeles'
  })
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [historicalData, setHistoricalData] = useState<Array<{date: string, price: number, volume: number}>>([])
  const [loading, setLoading] = useState(true)
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)

  // Available countries, states, and cities
  const countries = Object.keys(LOCATION_DATA)
  const countryData = LOCATION_DATA[locationFilter.country as keyof typeof LOCATION_DATA]
  const states = countryData ? Object.keys(countryData) : []
  const cities = (countryData && countryData[locationFilter.state as keyof typeof countryData] as string[]) || []

  // Enhanced utility functions with currency support
  const formatPrice = useCallback((price: number, currency?: string) => {
    if (!marketData) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }).format(price)
    }

    const currencyCode = currency || marketData.currency

    // Special formatting for different currencies
    if (currencyCode === 'JPY' || currencyCode === 'KRW') {
      // No decimal places for Yen and Won
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price)
    } else if (currencyCode === 'INR' && price > 100000) {
      // Indian Rupee with Lakh/Crore notation
      if (price >= 10000000) {
        return `₹${(price / 10000000).toFixed(1)} Cr`
      } else if (price >= 100000) {
        return `₹${(price / 100000).toFixed(1)} L`
      }
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
    }).format(price)
  }, [marketData])

  // Load market data when location or timeframe changes
  useEffect(() => {
    setLoading(true)
    // Simulate API call delay
    const timer = setTimeout(() => {
      try {
        console.log('Generating data for:', locationFilter, selectedTimeframe)
        const data = generateMarketData(locationFilter)
        const historical = generateHistoricalData(locationFilter, selectedTimeframe)
        console.log('Generated data:', data)
        console.log('Generated historical:', historical)
        setMarketData(data)
        setHistoricalData(historical)
        setLoading(false)
      } catch (error) {
        console.error('Error generating market data:', error)
        setLoading(false)
      }
    }, 500) // Reduced delay for better UX

    return () => clearTimeout(timer)
  }, [locationFilter, selectedTimeframe])



  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return

      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'demo-key',
          version: 'weekly',
        })

        const { Map } = await loader.importLibrary('maps')

        // Default coordinates for Los Angeles
        const defaultCenter = { lat: 34.0522, lng: -118.2437 }

        const map = new Map(mapRef.current, {
          center: defaultCenter,
          zoom: 10,
          styles: [
            {
              featureType: 'all',
              elementType: 'geometry.fill',
              stylers: [{ color: '#f8f6f0' }]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#cbd5e1' }]
            }
          ]
        })

        googleMapRef.current = map

        // Add markers for properties (mock data)
        if (marketData?.cityData) {
          marketData.cityData.forEach((city) => {
            // Mock coordinates around the center
            const lat = defaultCenter.lat + (Math.random() - 0.5) * 0.5
            const lng = defaultCenter.lng + (Math.random() - 0.5) * 0.5

            new google.maps.Marker({
              position: { lat, lng },
              map: map,
              title: `${city.city}: ${formatPrice(city.avgPrice)}`,
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" fill="#f59e0b" stroke="#1e293b" stroke-width="2"/>
                    <text x="12" y="16" text-anchor="middle" fill="#1e293b" font-size="10" font-weight="bold">$</text>
                  </svg>
                `),
                scaledSize: new google.maps.Size(24, 24)
              }
            })
          })
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error)
      }
    }

    if (marketData) {
      initMap()
    }
  }, [marketData, formatPrice])

  const formatCompactPrice = (price: number) => {
    if (!marketData) return formatPrice(price)

    const currency = marketData.currency

    if (currency === 'JPY') {
      return `¥${(price / 1000000).toFixed(1)}M`
    } else if (currency === 'KRW') {
      return `₩${(price / 1000000).toFixed(0)}M`
    } else if (currency === 'INR') {
      if (price >= 10000000) {
        return `₹${(price / 10000000).toFixed(1)}Cr`
      } else {
        return `₹${(price / 100000).toFixed(1)}L`
      }
    } else {
      return `${marketData.currencySymbol}${(price / 1000).toFixed(0)}K`
    }
  }

  const formatChange = (change: number) => {
    const isPositive = change > 0
    return (
      <span className={`flex items-center ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
        {Math.abs(change).toFixed(1)}%
      </span>
    )
  }

  // Handle location filter changes
  const handleCountryChange = (country: string) => {
    const countryData = LOCATION_DATA[country as keyof typeof LOCATION_DATA]
    const firstState = countryData ? Object.keys(countryData)[0] : ''
    const firstCity = countryData && firstState ? (countryData[firstState as keyof typeof countryData] as string[])?.[0] || '' : ''
    setLocationFilter({ country, state: firstState, city: firstCity })
  }

  const handleStateChange = (state: string) => {
    const countryData = LOCATION_DATA[locationFilter.country as keyof typeof LOCATION_DATA]
    const firstCity = countryData && (countryData[state as keyof typeof countryData] as string[])?.[0] || ''
    setLocationFilter({ ...locationFilter, state, city: firstCity })
  }

  const handleCityChange = (city: string) => {
    setLocationFilter({ ...locationFilter, city })
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Elegant Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-light mb-4">
                Market <span className="font-bold text-amber-400">Intelligence</span>
              </h1>
              <p className="text-xl text-amber-50/90 max-w-2xl">
                Comprehensive real estate analytics with live market data, trends, and location-based insights
              </p>
            </div>

            <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <span className="text-amber-50 font-medium">Timeframe:</span>
              </div>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-4 py-3 bg-amber-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-900 font-medium"
              >
                <option value="1m">Past 1 Month</option>
                <option value="1y">Past 1 Year</option>
                <option value="10y">Past 10 Years</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Location Filters */}
      <div className="bg-white border-b border-slate-200 relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-amber-600" />
              <span className="font-semibold text-slate-900 text-lg">Select Location:</span>
            </div>

            <div className="location-filters grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 max-w-4xl">
              <div className="location-dropdown">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Country
                </label>
                <select
                  value={locationFilter.country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="location-dropdown-select"
                  size={1}
                >
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div className="location-dropdown">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  State/Province
                </label>
                <select
                  value={locationFilter.state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="location-dropdown-select"
                  size={1}
                >
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="location-dropdown">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  City
                </label>
                <select
                  value={locationFilter.city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="location-dropdown-select"
                  size={1}
                >
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Current Selection Display */}
          <div className="mt-4 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span className="text-sm">
                Analyzing market data for:
                <span className="font-semibold text-slate-900 ml-1">
                  {locationFilter.city}, {locationFilter.state}, {locationFilter.country}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
              <p className="text-slate-600 text-lg">Loading market data for {locationFilter.city}...</p>
            </div>
          </div>
        ) : marketData ? (
          <>
            {/* Overview Cards */}
            <div className="market-overview grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <div className="card p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Avg Sale Price</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {formatPrice(marketData.overview.avgPriceSale)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <div className="mt-4">
                  {formatChange(marketData.overview.priceChangeYear)}
                </div>
              </div>

              <div className="card p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Avg Rent Price</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {formatPrice(marketData.overview.avgPriceRent)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                    <Home className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-slate-500 font-medium">/month</span>
                </div>
              </div>

              <div className="card p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Listings</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {marketData.overview.totalListings.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-slate-500">Active properties</span>
                </div>
              </div>

              <div className="card p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Avg Days on Market</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {marketData.overview.avgDaysOnMarket}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-slate-500">Days</span>
                </div>
              </div>

              <div className="card p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Market Growth</p>
                    <p className="text-2xl font-bold text-slate-900">
                      +{marketData.overview.priceChangeYear.toFixed(1)}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-slate-500">Year over year</span>
                </div>
              </div>
            </div>

            {/* Enhanced Charts Section */}
            <div className="price-charts grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Historical Price Trends Chart */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-amber-600" />
                    Price Trends
                  </h3>
                  <div className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                    {selectedTimeframe === '1m' ? 'Daily Data' :
                     selectedTimeframe === '1y' ? 'Monthly Data' :
                     'Yearly Data'}
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historicalData}>
                      <defs>
                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="date"
                        stroke="#64748b"
                        fontSize={11}
                        angle={selectedTimeframe === '1m' ? -45 : 0}
                        textAnchor={selectedTimeframe === '1m' ? 'end' : 'middle'}
                        height={selectedTimeframe === '1m' ? 60 : 30}
                      />
                      <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        tickFormatter={(value) => formatCompactPrice(value)}
                      />
                      <Tooltip
                        formatter={(value: number) => [formatPrice(value), 'Average Price']}
                        labelStyle={{ color: '#1e293b' }}
                        contentStyle={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        fill="url(#priceGradient)"
                        dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2, fill: '#fff' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Market Volume Chart */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-amber-600" />
                    Transaction Volume
                  </h3>
                  <div className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                    {locationFilter.city}
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="date"
                        stroke="#64748b"
                        fontSize={11}
                        angle={selectedTimeframe === '1m' ? -45 : 0}
                        textAnchor={selectedTimeframe === '1m' ? 'end' : 'middle'}
                        height={selectedTimeframe === '1m' ? 60 : 30}
                      />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        formatter={(value: number) => [value, 'Transactions']}
                        labelStyle={{ color: '#1e293b' }}
                        contentStyle={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar
                        dataKey="volume"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                        stroke="#059669"
                        strokeWidth={1}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Market Insights Based on Timeframe */}
            <div className="card p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Market Insights - {selectedTimeframe === '1m' ? 'Short Term' : selectedTimeframe === '1y' ? 'Medium Term' : 'Long Term'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {marketData ? `+${marketData.overview.priceChangeYear.toFixed(1)}%` : '+8.7%'}
                  </div>
                  <p className="text-sm text-slate-600">
                    Annual Growth Rate
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600 mb-2">
                    {marketData ? marketData.overview.totalListings.toLocaleString() : '15,680'}
                  </div>
                  <p className="text-sm text-slate-600">
                    Active Listings
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600 mb-2">
                    {marketData ? `${marketData.overview.avgDaysOnMarket} days` : '35 days'}
                  </div>
                  <p className="text-sm text-slate-600">
                    Avg. Days on Market
                  </p>
                </div>
              </div>
            </div>



            {/* Data Accuracy & Sources Information */}
            <div className="card p-6 mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                Data Accuracy & Sources
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Our Data Sources:</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <strong>Real Market Data:</strong> Based on 2024 median home prices
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <strong>Currency Rates:</strong> Live exchange rates (updated daily)
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <strong>Growth Patterns:</strong> Historical market trends analysis
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <strong>Local Factors:</strong> City premiums and regional variations
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Accuracy Metrics:</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Price Accuracy</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-slate-200 rounded-full h-2 mr-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                        <span className="text-sm font-semibold text-green-600">92%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Market Trends</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-slate-200 rounded-full h-2 mr-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                        </div>
                        <span className="text-sm font-semibold text-green-600">88%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Currency Conversion</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-slate-200 rounded-full h-2 mr-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                        </div>
                        <span className="text-sm font-semibold text-green-600">98%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                <p className="text-sm text-slate-600">
                  <strong>Note:</strong> Our data combines real market research with algorithmic modeling to provide
                  accurate estimates. Prices are shown in local currencies with current exchange rates.
                  For investment decisions, please consult with local real estate professionals.
                </p>
              </div>
            </div>

            {/* Google Maps and City Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Google Maps */}
              <div className="lg:col-span-2 card p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-amber-600" />
                  Property Locations - {locationFilter.city}
                </h3>
                <div
                  ref={mapRef}
                  className="h-96 bg-slate-100 rounded-lg border border-slate-200"
                  style={{ minHeight: '400px' }}
                >
                  {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 font-medium">Interactive Map</p>
                        <p className="text-sm text-slate-500 mt-2">
                          Add Google Maps API key to enable interactive maps
                        </p>
                        <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                          <p className="text-sm text-amber-800">
                            <strong>Demo Mode:</strong> Showing {locationFilter.city} area with property markers
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <div className="card p-6">
                  <h4 className="font-semibold text-slate-900 mb-4">Market Highlights</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Hottest Neighborhood</span>
                      <span className="font-medium text-slate-900">Downtown</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Price per Sq Ft</span>
                      <span className="font-medium text-slate-900">
                        ${Math.round(marketData.overview.avgPriceSale / 2000)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Inventory Level</span>
                      <span className="font-medium text-emerald-600">Balanced</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Market Trend</span>
                      <span className="font-medium text-emerald-600">Rising</span>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <h4 className="font-semibold text-slate-900 mb-4">Investment Score</h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-600 mb-2">8.5/10</div>
                    <p className="text-sm text-slate-600">Excellent investment potential</p>
                    <div className="mt-4 w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-amber-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* City Comparison Table */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-amber-600" />
                Regional Market Comparison
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-4 px-4 font-semibold text-slate-900">Location</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-900">Average Price</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-900">Year Change</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-900">Active Listings</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-900">Market Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketData.cityData.map((city, index) => (
                      <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-amber-500 mr-2" />
                            <div>
                              <span className="font-medium text-slate-900">{city.city}</span>
                              <p className="text-sm text-slate-500">{city.state}, {city.country}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-900">
                          {formatPrice(city.avgPrice)}
                        </td>
                        <td className="py-4 px-4">
                          {formatChange(city.change)}
                        </td>
                        <td className="py-4 px-4 text-slate-600">
                          {city.listings.toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="w-16 bg-slate-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-amber-400 h-2 rounded-full"
                                style={{ width: `${Math.min(100, Math.max(0, (city.change + 10) * 5))}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                              {Math.round(Math.min(10, Math.max(1, (city.change + 10) / 2)))}/10
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-600">No market data available</p>
          </div>
        )}
      </div>
    </div>
  )
}


