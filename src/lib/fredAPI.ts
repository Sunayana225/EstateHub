// FRED API integration for real economic indicators
// Get your free API key at: https://fredaccount.stlouisfed.org/apikeys

const FRED_API_KEY = process.env.NEXT_PUBLIC_FRED_API_KEY || 'demo_key'
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred'

export interface FredObservation {
  date: string
  value: string
  realtime_start: string
  realtime_end: string
}

export interface FredSeriesResponse {
  realtime_start: string
  realtime_end: string
  observation_start: string
  observation_end: string
  units: string
  output_type: number
  file_type: string
  order_by: string
  sort_order: string
  count: number
  offset: number
  limit: number
  observations: FredObservation[]
}

// Key housing-related FRED series IDs
export const HOUSING_SERIES = {
  // Case-Shiller U.S. National Home Price Index
  HOME_PRICE_INDEX: 'CSUSHPINSA',
  // 30-Year Fixed Rate Mortgage Average in the United States
  MORTGAGE_RATE: 'MORTGAGE30US',
  // Housing Starts: Total: New Privately Owned Housing Units Started
  HOUSING_STARTS: 'HOUST',
  // Existing Home Sales
  EXISTING_HOME_SALES: 'EXHOSLUSM495S',
  // New Home Sales
  NEW_HOME_SALES: 'HSN1F',
  // Median Sales Price of Houses Sold for the United States
  MEDIAN_SALES_PRICE: 'MSPUS',
  // Consumer Price Index for All Urban Consumers: Shelter
  SHELTER_CPI: 'CUSR0000SAH1',
  // Real Estate Loans at All Commercial Banks
  RE_LOANS: 'REALLN'
}

class FredAPIService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = FRED_API_KEY
    this.baseUrl = FRED_BASE_URL
  }

  /**
   * Fetch observations for a specific series
   */
  async getSeriesObservations(
    seriesId: string,
    startDate?: string,
    endDate?: string,
    limit: number = 100
  ): Promise<FredObservation[]> {
    try {
      const params = new URLSearchParams({
        series_id: seriesId,
        api_key: this.apiKey,
        file_type: 'json',
        limit: limit.toString(),
        sort_order: 'desc'
      })

      if (startDate) params.append('observation_start', startDate)
      if (endDate) params.append('observation_end', endDate)

      const response = await fetch(`${this.baseUrl}/series/observations?${params}`)
      
      if (!response.ok) {
        throw new Error(`FRED API error: ${response.status}`)
      }

      const data: FredSeriesResponse = await response.json()
      return data.observations.filter(obs => obs.value !== '.')
    } catch (error) {
      console.error(`Error fetching FRED series ${seriesId}:`, error)
      return []
    }
  }

  /**
   * Get recent housing market indicators
   */
  async getHousingIndicators() {
    try {
      const [
        homePriceIndex,
        mortgageRates,
        housingStarts,
        existingHomeSales
      ] = await Promise.all([
        this.getSeriesObservations(HOUSING_SERIES.HOME_PRICE_INDEX, undefined, undefined, 12),
        this.getSeriesObservations(HOUSING_SERIES.MORTGAGE_RATE, undefined, undefined, 12),
        this.getSeriesObservations(HOUSING_SERIES.HOUSING_STARTS, undefined, undefined, 12),
        this.getSeriesObservations(HOUSING_SERIES.EXISTING_HOME_SALES, undefined, undefined, 12)
      ])

      return {
        homePriceIndex: this.processObservations(homePriceIndex),
        mortgageRates: this.processObservations(mortgageRates),
        housingStarts: this.processObservations(housingStarts),
        existingHomeSales: this.processObservations(existingHomeSales)
      }
    } catch (error) {
      console.error('Error fetching housing indicators:', error)
      return null
    }
  }

  /**
   * Get historical data for charts
   */
  async getHistoricalHousingData(timeframe: '1m' | '1y' | '10y' = '1y') {
    const endDate = new Date().toISOString().split('T')[0]
    let startDate: string

    switch (timeframe) {
      case '1m':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        break
      case '1y':
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        break
      case '10y':
        startDate = new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        break
    }

    try {
      const [homePriceData, mortgageData] = await Promise.all([
        this.getSeriesObservations(HOUSING_SERIES.HOME_PRICE_INDEX, startDate, endDate, 1000),
        this.getSeriesObservations(HOUSING_SERIES.MORTGAGE_RATE, startDate, endDate, 1000)
      ])

      return {
        homePrices: this.processObservations(homePriceData).reverse(),
        mortgageRates: this.processObservations(mortgageData).reverse()
      }
    } catch (error) {
      console.error('Error fetching historical housing data:', error)
      return null
    }
  }

  /**
   * Process observations into chart-friendly format
   */
  private processObservations(observations: FredObservation[]) {
    return observations.map(obs => ({
      date: this.formatDate(obs.date),
      value: parseFloat(obs.value),
      rawDate: obs.date
    })).filter(item => !isNaN(item.value))
  }

  /**
   * Format date for display
   */
  private formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short',
      day: undefined
    })
  }

  /**
   * Calculate percentage change
   */
  calculateChange(data: Array<{value: number}>): number {
    if (data.length < 2) return 0
    const latest = data[0].value
    const previous = data[1].value
    return ((latest - previous) / previous) * 100
  }

  /**
   * Get latest value from series
   */
  getLatestValue(data: Array<{value: number}>): number {
    return data.length > 0 ? data[0].value : 0
  }
}

export const fredAPI = new FredAPIService()

// Demo data fallback when API key is not available
export const getDemoHousingData = () => ({
  homePriceIndex: [
    { date: 'Dec 2024', value: 315.2, rawDate: '2024-12-01' },
    { date: 'Nov 2024', value: 314.1, rawDate: '2024-11-01' },
    { date: 'Oct 2024', value: 313.5, rawDate: '2024-10-01' }
  ],
  mortgageRates: [
    { date: 'Dec 2024', value: 6.81, rawDate: '2024-12-01' },
    { date: 'Nov 2024', value: 6.78, rawDate: '2024-11-01' },
    { date: 'Oct 2024', value: 6.72, rawDate: '2024-10-01' }
  ],
  housingStarts: [
    { date: 'Dec 2024', value: 1.35, rawDate: '2024-12-01' },
    { date: 'Nov 2024', value: 1.33, rawDate: '2024-11-01' },
    { date: 'Oct 2024', value: 1.31, rawDate: '2024-10-01' }
  ],
  existingHomeSales: [
    { date: 'Dec 2024', value: 4.15, rawDate: '2024-12-01' },
    { date: 'Nov 2024', value: 4.12, rawDate: '2024-11-01' },
    { date: 'Oct 2024', value: 4.09, rawDate: '2024-10-01' }
  ]
})
