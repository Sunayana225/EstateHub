// Real Estate API utilities for fetching market data

// Types for API responses
export interface MarketData {
  overview: {
    avgPriceSale: number;
    avgPriceRent: number;
    priceChangeYear: number;
    totalListings: number;
    avgDaysOnMarket: number;
    currency: string;
    currencySymbol: string;
  };
  cityData: CityData[];
  monthlyTrends: MonthlyTrend[];
  priceHistory: PriceHistoryPoint[];
  currency: string;
  currencySymbol: string;
}

export interface CityData {
  city: string;
  state: string;
  country: string;
  avgPrice: number;
  change: number;
  listings: number;
  lat?: number;
  lng?: number;
}

export interface MonthlyTrend {
  month: string;
  sales: number;
  rentals: number;
  volume: number;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  volume: number;
}

export interface LocationFilter {
  country: string;
  state: string;
  city: string;
}

// Note: Free APIs for real estate data are available but not currently used
// Examples: FRED API, Census API, OpenCage Geocoding API

// Comprehensive global location data
export const LOCATION_DATA = {
  'United States': {
    'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'Fresno'],
    'New York': ['New York City', 'Buffalo', 'Rochester', 'Syracuse', 'Albany'],
    'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
    'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
    'Illinois': ['Chicago', 'Aurora', 'Rockford', 'Joliet', 'Naperville'],
    'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading'],
    'Ohio': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron'],
    'Georgia': ['Atlanta', 'Augusta', 'Columbus', 'Savannah', 'Athens'],
    'North Carolina': ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem'],
    'Michigan': ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Lansing']
  },
  'Canada': {
    'Ontario': ['Toronto', 'Ottawa', 'Hamilton', 'London', 'Kitchener'],
    'British Columbia': ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond'],
    'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil'],
    'Alberta': ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat'],
    'Manitoba': ['Winnipeg', 'Brandon', 'Steinbach', 'Thompson', 'Portage la Prairie'],
    'Saskatchewan': ['Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw', 'Swift Current']
  },
  'United Kingdom': {
    'England': ['London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool'],
    'Scotland': ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Stirling'],
    'Wales': ['Cardiff', 'Swansea', 'Newport', 'Wrexham', 'Barry'],
    'Northern Ireland': ['Belfast', 'Derry', 'Lisburn', 'Newtownabbey', 'Bangor']
  },
  'Australia': {
    'New South Wales': ['Sydney', 'Newcastle', 'Wollongong', 'Central Coast', 'Maitland'],
    'Victoria': ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Frankston'],
    'Queensland': ['Brisbane', 'Gold Coast', 'Townsville', 'Cairns', 'Toowoomba'],
    'Western Australia': ['Perth', 'Fremantle', 'Rockingham', 'Mandurah', 'Bunbury'],
    'South Australia': ['Adelaide', 'Mount Gambier', 'Whyalla', 'Murray Bridge', 'Port Augusta'],
    'Tasmania': ['Hobart', 'Launceston', 'Devonport', 'Burnie', 'Kingston']
  },
  'Germany': {
    'Bavaria': ['Munich', 'Nuremberg', 'Augsburg', 'Regensburg', 'Ingolstadt'],
    'North Rhine-Westphalia': ['Cologne', 'Düsseldorf', 'Dortmund', 'Essen', 'Duisburg'],
    'Baden-Württemberg': ['Stuttgart', 'Mannheim', 'Karlsruhe', 'Freiburg', 'Heidelberg'],
    'Berlin': ['Berlin'],
    'Hamburg': ['Hamburg'],
    'Hesse': ['Frankfurt', 'Wiesbaden', 'Kassel', 'Darmstadt', 'Offenbach']
  },
  'France': {
    'Île-de-France': ['Paris', 'Boulogne-Billancourt', 'Saint-Denis', 'Argenteuil', 'Versailles'],
    'Provence-Alpes-Côte d\'Azur': ['Marseille', 'Nice', 'Toulon', 'Aix-en-Provence', 'Avignon'],
    'Auvergne-Rhône-Alpes': ['Lyon', 'Grenoble', 'Saint-Étienne', 'Villeurbanne', 'Clermont-Ferrand'],
    'Occitanie': ['Toulouse', 'Montpellier', 'Nîmes', 'Perpignan', 'Béziers'],
    'Nouvelle-Aquitaine': ['Bordeaux', 'Limoges', 'Poitiers', 'Pau', 'La Rochelle']
  },
  'Japan': {
    'Tokyo': ['Tokyo', 'Shibuya', 'Shinjuku', 'Harajuku', 'Ginza'],
    'Osaka': ['Osaka', 'Sakai', 'Higashiosaka', 'Hirakata', 'Suita'],
    'Kanagawa': ['Yokohama', 'Kawasaki', 'Sagamihara', 'Fujisawa', 'Chigasaki'],
    'Aichi': ['Nagoya', 'Toyota', 'Okazaki', 'Ichinomiya', 'Kasugai'],
    'Kyoto': ['Kyoto', 'Uji', 'Kameoka', 'Joyo', 'Mukō']
  },
  'South Korea': {
    'Seoul': ['Seoul', 'Gangnam', 'Hongdae', 'Myeongdong', 'Itaewon'],
    'Busan': ['Busan', 'Haeundae', 'Seomyeon', 'Nampo', 'Jagalchi'],
    'Incheon': ['Incheon', 'Songdo', 'Bupyeong', 'Namdong', 'Yeonsu'],
    'Daegu': ['Daegu', 'Jung-gu', 'Dong-gu', 'Seo-gu', 'Nam-gu'],
    'Gyeonggi': ['Suwon', 'Seongnam', 'Goyang', 'Yongin', 'Bucheon']
  },
  'Singapore': {
    'Central Region': ['Marina Bay', 'Orchard', 'Raffles Place', 'Chinatown', 'Little India'],
    'East Region': ['Bedok', 'Tampines', 'Pasir Ris', 'Changi', 'Simei'],
    'North Region': ['Woodlands', 'Yishun', 'Sembawang', 'Admiralty', 'Marsiling'],
    'West Region': ['Jurong', 'Clementi', 'Bukit Batok', 'Choa Chu Kang', 'Tuas'],
    'Northeast Region': ['Hougang', 'Punggol', 'Sengkang', 'Serangoon', 'Ang Mo Kio']
  },
  'United Arab Emirates': {
    'Dubai': ['Dubai Marina', 'Downtown Dubai', 'Jumeirah', 'Deira', 'Bur Dubai'],
    'Abu Dhabi': ['Abu Dhabi City', 'Al Ain', 'Madinat Zayed', 'Liwa', 'Ruwais'],
    'Sharjah': ['Sharjah City', 'Kalba', 'Khor Fakkan', 'Dibba Al-Hisn', 'Mleiha'],
    'Ajman': ['Ajman City', 'Masfout', 'Manama', 'Al Tallah', 'Al Jurf']
  },
  'India': {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik'],
    'Delhi': ['New Delhi', 'Old Delhi', 'Dwarka', 'Rohini', 'Karol Bagh'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi'],
    'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Hisar'],
    'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool'],
    'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur']
  },
  'China': {
    'Beijing': ['Beijing', 'Chaoyang', 'Haidian', 'Dongcheng', 'Xicheng'],
    'Shanghai': ['Shanghai', 'Pudong', 'Huangpu', 'Xuhui', 'Changning'],
    'Guangdong': ['Guangzhou', 'Shenzhen', 'Dongguan', 'Foshan', 'Zhongshan'],
    'Zhejiang': ['Hangzhou', 'Ningbo', 'Wenzhou', 'Jiaxing', 'Huzhou'],
    'Jiangsu': ['Nanjing', 'Suzhou', 'Wuxi', 'Changzhou', 'Nantong']
  }
};

// Generate historical data for different timeframes
export const generateHistoricalData = (location: LocationFilter, timeframe: string) => {
  const basePriceData = getBasePriceForLocation(location);
  const data = [];

  let periods: number;
  let dateFormat: string;
  let periodType: 'day' | 'month' | 'year';

  switch (timeframe) {
    case '1m':
      periods = 30;
      dateFormat = 'MMM DD';
      periodType = 'day';
      break;
    case '1y':
      periods = 12;
      dateFormat = 'MMM YYYY';
      periodType = 'month';
      break;
    case '10y':
      periods = 10;
      dateFormat = 'YYYY';
      periodType = 'year';
      break;
    default:
      periods = 12;
      dateFormat = 'MMM YYYY';
      periodType = 'month';
  }

  for (let i = periods - 1; i >= 0; i--) {
    const date = new Date();

    if (periodType === 'day') {
      date.setDate(date.getDate() - i);
    } else if (periodType === 'month') {
      date.setMonth(date.getMonth() - i);
    } else {
      date.setFullYear(date.getFullYear() - i);
    }

    // Generate realistic price trends
    let trendMultiplier = 1;
    if (timeframe === '10y') {
      // 10-year trend: generally upward with some volatility
      trendMultiplier = 0.7 + (periods - i) * 0.05 + (Math.random() - 0.5) * 0.1;
    } else if (timeframe === '1y') {
      // 1-year trend: seasonal patterns
      const monthIndex = date.getMonth();
      const seasonalMultiplier = 0.9 + 0.2 * Math.sin((monthIndex + 3) * Math.PI / 6);
      trendMultiplier = seasonalMultiplier + (Math.random() - 0.5) * 0.05;
    } else {
      // 1-month trend: daily fluctuations
      trendMultiplier = 0.98 + Math.random() * 0.04;
    }

    const price = Math.round(basePriceData.price * trendMultiplier);
    const volume = Math.round(50 + Math.random() * 100);

    // Calculate rent based on country-specific ratios
    const rentMultipliers: Record<string, number> = {
      'United States': 0.004, 'Canada': 0.0035, 'United Kingdom': 0.0045,
      'Australia': 0.004, 'Germany': 0.003, 'France': 0.0035,
      'Japan': 0.005, 'South Korea': 0.0025, 'Singapore': 0.003,
      'United Arab Emirates': 0.006, 'India': 0.008, 'China': 0.002
    };
    const rentMultiplier = rentMultipliers[location.country] || 0.004;

    data.push({
      date: formatDate(date, dateFormat),
      price,
      volume,
      sales: price,
      rentals: Math.round(price * rentMultiplier)
    });
  }

  return data;
};

const formatDate = (date: Date, format: string): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (format === 'MMM DD') {
    return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}`;
  } else if (format === 'MMM YYYY') {
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  } else if (format === 'YYYY') {
    return date.getFullYear().toString();
  }
  return date.toISOString().split('T')[0];
};

// Currency information for each country
export const CURRENCY_DATA: Record<string, { code: string; symbol: string; rate: number }> = {
  'United States': { code: 'USD', symbol: '$', rate: 1.0 },
  'Canada': { code: 'CAD', symbol: 'C$', rate: 1.35 },
  'United Kingdom': { code: 'GBP', symbol: '£', rate: 0.79 },
  'Australia': { code: 'AUD', symbol: 'A$', rate: 1.52 },
  'Germany': { code: 'EUR', symbol: '€', rate: 0.92 },
  'France': { code: 'EUR', symbol: '€', rate: 0.92 },
  'Japan': { code: 'JPY', symbol: '¥', rate: 149.0 },
  'South Korea': { code: 'KRW', symbol: '₩', rate: 1320.0 },
  'Singapore': { code: 'SGD', symbol: 'S$', rate: 1.34 },
  'United Arab Emirates': { code: 'AED', symbol: 'د.إ', rate: 3.67 },
  'India': { code: 'INR', symbol: '₹', rate: 83.0 },
  'China': { code: 'CNY', symbol: '¥', rate: 7.24 }
};

// More accurate base prices based on real market data (2024)
const getBasePriceForLocation = (location: LocationFilter): { price: number; currency: string; symbol: string } => {
  const basePricesUSD: Record<string, number> = {
    'United States': 420000,     // Median home price ~$420k
    'Canada': 380000,            // ~CAD $515k = USD $380k
    'United Kingdom': 350000,    // ~£275k = USD $350k
    'Australia': 450000,         // ~AUD $685k = USD $450k
    'Germany': 380000,           // ~€350k = USD $380k
    'France': 320000,            // ~€295k = USD $320k
    'Japan': 280000,             // ~¥42M = USD $280k
    'South Korea': 320000,       // ~₩420M = USD $320k
    'Singapore': 850000,         // ~SGD $1.14M = USD $850k
    'United Arab Emirates': 250000, // ~AED 920k = USD $250k
    'India': 45000,              // ~₹3.7M = USD $45k
    'China': 120000              // ~¥870k = USD $120k
  };

  const currency = CURRENCY_DATA[location.country];
  const basePriceUSD = basePricesUSD[location.country] || 300000;
  const localPrice = Math.round(basePriceUSD * currency.rate);

  return {
    price: localPrice,
    currency: currency.code,
    symbol: currency.symbol
  };
};

// Generate realistic market data based on location and economic factors
export const generateMarketData = (location: LocationFilter): MarketData => {
  const basePriceData = getBasePriceForLocation(location);

  // Comprehensive city multipliers for global markets
  const cityMultipliers: Record<string, number> = {
    // United States
    'New York City': 2.1, 'San Francisco': 2.3, 'Los Angeles': 1.8, 'Chicago': 1.4, 'Miami': 1.5,
    'Boston': 1.7, 'Seattle': 1.8, 'Washington DC': 1.9, 'San Diego': 1.6, 'Austin': 1.3,

    // Canada
    'Toronto': 1.9, 'Vancouver': 2.0, 'Montreal': 1.4, 'Calgary': 1.2, 'Ottawa': 1.5,

    // United Kingdom
    'London': 2.2, 'Manchester': 1.3, 'Birmingham': 1.2, 'Edinburgh': 1.4, 'Glasgow': 1.1,

    // Australia
    'Sydney': 1.9, 'Melbourne': 1.6, 'Brisbane': 1.3, 'Perth': 1.2, 'Adelaide': 1.1,

    // Germany
    'Munich': 1.8, 'Frankfurt': 1.7, 'Hamburg': 1.5, 'Berlin': 1.4, 'Cologne': 1.3,

    // France
    'Paris': 2.0, 'Lyon': 1.4, 'Marseille': 1.2, 'Nice': 1.6, 'Toulouse': 1.3,

    // Japan
    'Tokyo': 1.8, 'Osaka': 1.4, 'Yokohama': 1.5, 'Kyoto': 1.3, 'Nagoya': 1.2,

    // South Korea
    'Seoul': 1.7, 'Busan': 1.2, 'Incheon': 1.3, 'Daegu': 1.1, 'Suwon': 1.4,

    // Singapore
    'Marina Bay': 2.2, 'Orchard': 2.0, 'Raffles Place': 1.9, 'Sentosa': 2.1, 'Jurong': 1.3,

    // UAE
    'Dubai Marina': 1.8, 'Downtown Dubai': 2.0, 'Abu Dhabi City': 1.5, 'Sharjah City': 1.2,

    // India
    'Mumbai': 1.6, 'New Delhi': 1.4, 'Bangalore': 1.3, 'Chennai': 1.2, 'Pune': 1.3,

    // China
    'Shanghai': 1.7, 'Beijing': 1.6, 'Shenzhen': 1.5, 'Guangzhou': 1.4, 'Hangzhou': 1.3
  };

  const cityMultiplier = cityMultipliers[location.city] || 1.0;
  const avgPrice = Math.round(basePriceData.price * cityMultiplier);

  // Calculate rent based on local market conditions
  const rentMultipliers: Record<string, number> = {
    'United States': 0.004,      // ~0.4% of property value per month
    'Canada': 0.0035,            // ~0.35%
    'United Kingdom': 0.0045,    // ~0.45%
    'Australia': 0.004,          // ~0.4%
    'Germany': 0.003,            // ~0.3% (lower rent-to-price ratio)
    'France': 0.0035,            // ~0.35%
    'Japan': 0.005,              // ~0.5% (higher rental yields)
    'South Korea': 0.0025,       // ~0.25% (lower rental market)
    'Singapore': 0.003,          // ~0.3%
    'United Arab Emirates': 0.006, // ~0.6% (high rental yields)
    'India': 0.008,              // ~0.8% (high rental yields)
    'China': 0.002               // ~0.2% (very low rental yields)
  };

  const rentMultiplier = rentMultipliers[location.country] || 0.004;
  const avgRent = Math.round(avgPrice * rentMultiplier);

  // Generate monthly trends with seasonal patterns
  const monthlyTrends: MonthlyTrend[] = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  months.forEach((month, index) => {
    // Spring/summer typically see higher activity
    const seasonalMultiplier = 0.8 + 0.4 * Math.sin((index + 3) * Math.PI / 6);
    const sales = Math.round(avgPrice * seasonalMultiplier);
    const rentals = Math.round(sales * 0.004); // Typical rent-to-price ratio
    const volume = Math.round(100 + 50 * seasonalMultiplier);
    
    monthlyTrends.push({ month, sales, rentals, volume });
  });

  // Generate price history for the last 12 months
  const priceHistory: PriceHistoryPoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const trend = 1 + (Math.random() - 0.5) * 0.1; // ±5% variation
    const price = Math.round(avgPrice * trend);
    const volume = Math.round(80 + Math.random() * 40);
    
    priceHistory.push({
      date: date.toISOString().split('T')[0],
      price,
      volume
    });
  }

  // Generate city data for the region
  const states = LOCATION_DATA[location.country as keyof typeof LOCATION_DATA] || {};
  const cityData: CityData[] = [];

  Object.entries(states).forEach(([state, cities]) => {
    cities.slice(0, 3).forEach(city => { // Top 3 cities per state
      const multiplier = cityMultipliers[city] || (0.8 + Math.random() * 0.4);
      const price = Math.round(basePriceData.price * multiplier);
      const change = -5 + Math.random() * 15; // -5% to +10% change
      const listings = Math.round(500 + Math.random() * 2000);

      cityData.push({
        city,
        state,
        country: location.country,
        avgPrice: price,
        change,
        listings
      });
    });
  });

  return {
    overview: {
      avgPriceSale: avgPrice,
      avgPriceRent: avgRent,
      priceChangeYear: getRealisticGrowthRate(location.country),
      totalListings: getRealisticListingCount(location.country, location.city),
      avgDaysOnMarket: getRealisticDaysOnMarket(location.country),
      currency: basePriceData.currency,
      currencySymbol: basePriceData.symbol
    },
    cityData: cityData.slice(0, 8), // Top 8 cities
    monthlyTrends,
    priceHistory,
    currency: basePriceData.currency,
    currencySymbol: basePriceData.symbol
  };
};

// More realistic growth rates based on actual market conditions
const getRealisticGrowthRate = (country: string): number => {
  const growthRates: Record<string, number> = {
    'United States': 3.5 + Math.random() * 4,      // 3.5-7.5%
    'Canada': 2.8 + Math.random() * 5,             // 2.8-7.8%
    'United Kingdom': 1.5 + Math.random() * 4,     // 1.5-5.5%
    'Australia': 4.2 + Math.random() * 6,          // 4.2-10.2%
    'Germany': 2.1 + Math.random() * 3,            // 2.1-5.1%
    'France': 1.8 + Math.random() * 3.5,           // 1.8-5.3%
    'Japan': -0.5 + Math.random() * 2,             // -0.5-1.5%
    'South Korea': 1.2 + Math.random() * 4,        // 1.2-5.2%
    'Singapore': 2.5 + Math.random() * 5,          // 2.5-7.5%
    'United Arab Emirates': 3.8 + Math.random() * 6, // 3.8-9.8%
    'India': 6.5 + Math.random() * 8,              // 6.5-14.5%
    'China': 0.5 + Math.random() * 3               // 0.5-3.5%
  };

  return Number((growthRates[country] || 3.0).toFixed(1));
};

// Realistic listing counts based on market size
const getRealisticListingCount = (country: string, city: string): number => {
  const baseListings: Record<string, number> = {
    'United States': 25000,
    'Canada': 15000,
    'United Kingdom': 18000,
    'Australia': 12000,
    'Germany': 20000,
    'France': 16000,
    'Japan': 22000,
    'South Korea': 14000,
    'Singapore': 8000,
    'United Arab Emirates': 10000,
    'India': 35000,
    'China': 45000
  };

  const majorCityMultipliers: Record<string, number> = {
    'New York City': 3.5, 'Los Angeles': 2.8, 'London': 3.2, 'Tokyo': 4.0,
    'Mumbai': 3.8, 'Shanghai': 4.2, 'Dubai Marina': 2.5, 'Singapore': 2.0
  };

  const base = baseListings[country] || 15000;
  const multiplier = majorCityMultipliers[city] || (0.8 + Math.random() * 0.4);

  return Math.round(base * multiplier);
};

// Realistic days on market based on local conditions
const getRealisticDaysOnMarket = (country: string): number => {
  const daysOnMarket: Record<string, number> = {
    'United States': 25 + Math.random() * 15,      // 25-40 days
    'Canada': 20 + Math.random() * 20,             // 20-40 days
    'United Kingdom': 35 + Math.random() * 25,     // 35-60 days
    'Australia': 30 + Math.random() * 20,          // 30-50 days
    'Germany': 45 + Math.random() * 30,            // 45-75 days
    'France': 40 + Math.random() * 25,             // 40-65 days
    'Japan': 60 + Math.random() * 40,              // 60-100 days
    'South Korea': 35 + Math.random() * 25,        // 35-60 days
    'Singapore': 15 + Math.random() * 15,          // 15-30 days
    'United Arab Emirates': 20 + Math.random() * 20, // 20-40 days
    'India': 45 + Math.random() * 35,              // 45-80 days
    'China': 50 + Math.random() * 30               // 50-80 days
  };

  return Math.round(daysOnMarket[country] || 35);
};

// Geocoding function for Google Maps
export const geocodeLocation = async (location: string): Promise<{lat: number, lng: number} | null> => {
  try {
    // This would use Google Geocoding API in production
    // For now, return approximate coordinates for major cities
    const coordinates: Record<string, {lat: number, lng: number}> = {
      'New York City': { lat: 40.7128, lng: -74.0060 },
      'Los Angeles': { lat: 34.0522, lng: -118.2437 },
      'Chicago': { lat: 41.8781, lng: -87.6298 },
      'Houston': { lat: 29.7604, lng: -95.3698 },
      'Phoenix': { lat: 33.4484, lng: -112.0740 },
      'Philadelphia': { lat: 39.9526, lng: -75.1652 },
      'San Antonio': { lat: 29.4241, lng: -98.4936 },
      'San Diego': { lat: 32.7157, lng: -117.1611 },
      'Dallas': { lat: 32.7767, lng: -96.7970 },
      'San Jose': { lat: 37.3382, lng: -121.8863 }
    };
    
    return coordinates[location] || null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};
