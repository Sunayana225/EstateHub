export interface Property {
  id: string
  title: string
  description: string
  price: number
  property_type: 'sale' | 'rent'
  bedrooms: number
  bathrooms: number
  area_sqft: number
  address: string
  city: string
  state: string
  zip_code: string
  latitude?: number
  longitude?: number
  images: string[]
  amenities: string[]
  status: 'active' | 'pending' | 'sold' | 'rented'
  user_id: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  avatar_url?: string
  created_at: string
}

export interface MarketData {
  id: string
  city: string
  state: string
  avg_price_sale: number
  avg_price_rent: number
  price_change_year: number
  total_listings: number
  month: string
  year: number
  created_at: string
}

export interface PropertyFilters {
  property_type?: 'sale' | 'rent'
  min_price?: number
  max_price?: number
  bedrooms?: number
  bathrooms?: number
  city?: string
  state?: string
  min_area?: number
  max_area?: number
}

export interface SearchParams {
  query?: string
  filters?: PropertyFilters
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'oldest'
  page?: number
  limit?: number
}
