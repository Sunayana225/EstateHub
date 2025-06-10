'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, TrendingUp, Shield, Users, ArrowRight } from 'lucide-react'
import SearchWithDropdown from '@/components/SearchWithDropdown'

export default function Home() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/properties?search=${encodeURIComponent(query.trim())}`)
    } else {
      router.push('/properties')
    }
  }

  const features = [
    {
      icon: Search,
      title: 'Smart Property Search',
      description: 'Advanced filters and AI-powered recommendations to find your perfect property.'
    },
    {
      icon: TrendingUp,
      title: 'Market Analytics',
      description: 'Real-time market data and trends to make informed investment decisions.'
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'End-to-end encrypted transactions with verified property listings.'
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: '24/7 support from real estate professionals and market experts.'
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Properties Listed' },
    { number: '5,000+', label: 'Happy Customers' },
    { number: '50+', label: 'Cities Covered' },
    { number: '98%', label: 'Success Rate' }
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Hero Section */}
      <section className="relative luxury-gradient text-amber-50 py-12 lg:py-20">
        {/* Elegant overlay pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F59E0B' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Elegant heading with refined typography */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-light mb-4 tracking-tight">
                Discover
                <span className="block font-bold text-amber-400">Exceptional Properties</span>
              </h1>
              <div className="w-24 h-1 bg-amber-400 mx-auto mb-6"></div>
            </div>

            <p className="text-xl md:text-2xl mb-12 text-amber-50/90 max-w-4xl mx-auto font-light leading-relaxed">
              Where luxury meets opportunity. Experience premium real estate with sophisticated market insights,
              seamless transactions, and personalized service that exceeds expectations.
            </p>

            {/* Elegant Search Bar */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className="glass-effect p-6 rounded-2xl shadow-2xl">
                <SearchWithDropdown
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={handleSearch}
                  placeholder="Location, property type, or keywords..."
                  className="search-with-dropdown-home"
                />
              </div>
            </div>

            {/* Refined CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/properties" className="btn-primary flex items-center justify-center text-lg">
                Explore Collection
                <ArrowRight className="w-5 h-5 ml-3" />
              </Link>
              <Link href="/post-property" className="btn-secondary flex items-center justify-center text-lg">
                List Your Property
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Elegant Stats Section */}
      <section className="py-20 bg-white border-t border-slate-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="relative">
                  <div className="text-4xl md:text-5xl font-light text-slate-900 mb-3 transition-all duration-300 group-hover:text-amber-600">
                    {stat.number}
                  </div>
                  <div className="w-12 h-0.5 bg-amber-400 mx-auto mb-3 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <div className="text-slate-600 font-medium uppercase tracking-wider text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sophisticated Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6">
              Excellence in Every
              <span className="block font-bold text-amber-600">Detail</span>
            </h2>
            <div className="w-24 h-1 bg-amber-400 mx-auto mb-8"></div>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto font-light leading-relaxed">
              Experience unparalleled service with sophisticated technology and expert insights
              that transform your real estate journey into an extraordinary experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="group">
                  <div className="card p-8 text-center h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className="relative mb-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-amber-400 group-hover:to-amber-500 transition-all duration-500 shadow-lg">
                        <Icon className="w-10 h-10 text-amber-50 group-hover:text-slate-900 transition-colors duration-500" />
                      </div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-amber-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Elegant CTA Section */}
      <section className="py-24 luxury-gradient text-amber-50 relative overflow-hidden">
        {/* Sophisticated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F59E0B' fill-opacity='0.1'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-light mb-4">
              Begin Your
              <span className="block font-bold text-amber-400">Luxury Journey</span>
            </h2>
            <div className="w-24 h-1 bg-amber-400 mx-auto mb-8"></div>
          </div>

          <p className="text-xl md:text-2xl mb-12 text-amber-50/90 max-w-4xl mx-auto font-light leading-relaxed">
            Join an exclusive community of discerning clients who have discovered
            their perfect properties through our sophisticated platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/properties" className="btn-primary text-lg">
              Explore Our Collection
            </Link>
            <Link href="/market-analytics" className="btn-secondary text-lg">
              Market Intelligence
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
