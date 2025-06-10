import Link from 'next/link'
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white text-blue-600 border-t border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-light text-blue-900 tracking-wide">Estate</span>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest -mt-1">Hub</span>
              </div>
            </div>
            <p className="text-blue-700 text-sm leading-relaxed">
              Your trusted partner in finding the perfect property. We provide comprehensive real estate solutions with market analytics and professional guidance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-500 hover:text-blue-700 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-blue-500 hover:text-blue-700 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-blue-500 hover:text-blue-700 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-blue-500 hover:text-blue-700 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-blue-900 font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-blue-600 hover:text-blue-800 transition-colors text-sm">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/post-property" className="text-blue-600 hover:text-blue-800 transition-colors text-sm">
                  Post Property
                </Link>
              </li>
              <li>
                <Link href="/market-analytics" className="text-blue-600 hover:text-blue-800 transition-colors text-sm">
                  Market Analytics
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-blue-900 font-semibold text-lg">Services</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-blue-600 text-sm">Property Sales</span>
              </li>
              <li>
                <span className="text-blue-600 text-sm">Property Rentals</span>
              </li>
              <li>
                <span className="text-blue-600 text-sm">Market Analysis</span>
              </li>
              <li>
                <span className="text-blue-600 text-sm">Investment Consulting</span>
              </li>
              <li>
                <span className="text-blue-600 text-sm">Property Management</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-blue-900 font-semibold text-lg">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-blue-600 text-sm">123 MG Road, Bangalore, Karnataka 560001</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-blue-600 text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-blue-600 text-sm">info@estatehub.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-blue-600 text-sm">
              © 2024 EstateHub. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-blue-600 hover:text-blue-800 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-blue-600 hover:text-blue-800 transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="#" className="text-blue-600 hover:text-blue-800 transition-colors text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
