# 🏡 EstateHub - Advanced Real Estate Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue)](https://estate-hub-nine.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-green)](https://github.com/Sunayana225/EstateHub)

A sophisticated real estate platform built with cutting-edge technologies, designed to revolutionize property discovery, analysis, and management.

## 🌟 Why EstateHub?

EstateHub transforms the real estate experience by combining powerful features with an intuitive interface:

### 🚀 Key Advantages

- **Data-Driven Decisions**: Real-time market analytics powered by FRED API for informed property investments
- **Seamless Experience**: Modern React architecture with Next.js 15 for lightning-fast performance
- **User-Centric Design**: Responsive, accessible interface that works beautifully across all devices
- **Comprehensive Solution**: All-in-one platform for searching, comparing, analyzing, and managing properties
- **Secure Authentication**: Firebase-powered authentication system with multiple sign-in options
- **Location Intelligence**: Google Maps integration for spatial property analysis

### 💼 Perfect For

- **Home Buyers**: Find your dream home with advanced filters and detailed property information
- **Property Investors**: Analyze market trends with real economic data to make profitable decisions
- **Real Estate Agents**: Showcase properties with professional listings and detailed information
- **Market Analysts**: Track housing market indicators with interactive visualization tools

## 🔍 Core Features

### 🔐 **Authentication & User Management**
- **Multi-provider Authentication** via Firebase (Email/Password, Google)
- **Personalized Dashboard** with saved searches and favorites
- **User Profile Management** with custom preferences
- **Secure Session Handling** with persistent login

### 📊 **Market Intelligence**
- **Economic Indicator Integration** through FRED API:
  - Case-Shiller Home Price Index
  - Mortgage Rate Tracking
  - Housing Market Activity Metrics
- **Interactive Data Visualization** using Recharts and Chart.js
- **Historical Trend Analysis** with customizable time ranges
- **Multi-regional Comparisons** with currency localization

### 🏠 **Property Discovery & Management**
- **Advanced Property Search Engine** with multi-parameter filtering
- **Comprehensive Property Listings** with high-quality imagery
- **Property Submission System** with detailed attribute support
- **Favorites & Comparison Tools** for evaluating options
- **Location-aware Filtering** with hierarchical area selection

### 🗺️ **Spatial Analysis**
- **Interactive Mapping** with Google Maps API integration
- **Property Geolocation** with custom markers
- **Area-based Search** capabilities
- **Proximity Analysis** for amenities and services

### 📱 **Modern UI/UX**
- **Responsive Design System** using Tailwind CSS
- **Component-based Architecture** for consistent experience
- **Intuitive Navigation** with breadcrumbs and context-aware menus
- **Accessibility Compliance** for inclusive user experience
- **Guided Onboarding** with interactive tours

## 🛠️ Technology Stack

### Frontend
- **React 19**: Latest React version with improved performance
- **Next.js 15**: React framework with server-side rendering and routing
- **TypeScript**: Strongly-typed JavaScript for robust code
- **Tailwind CSS 4**: Utility-first CSS framework for responsive design
- **Chart.js & Recharts**: Data visualization libraries

### Backend & APIs
- **Firebase**: Authentication, real-time database, and storage
- **Supabase**: PostgreSQL database with real-time capabilities
- **FRED API**: Federal Reserve Economic Data for market analytics
- **Google Maps API**: Location services and mapping

### Development Tools
- **ESLint**: Code quality and style enforcement
- **React Hook Form**: Form validation with Zod schema
- **Axios**: Promise-based HTTP client
- **date-fns**: Modern date utility library
- **Turbopack**: Next.js bundler for fast development

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ (LTS recommended)
- npm or yarn package manager
- Firebase project (for authentication)
- FRED API key (free)
- Google Maps API key

### Setup & Installation

1. **Clone the repository**
```bash
git clone https://github.com/Sunayana225/EstateHub.git
cd EstateHub
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

4. **Configure your API keys in .env.local**

5. **Start the development server**
```bash
npm run dev
```

6. **Access the application**
Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 API Configuration

### 🔥 Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password and Google providers
3. Add your app to the project and get configuration
4. Configure in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 📈 FRED API Integration

1. Register at [FRED API](https://fredaccount.stlouisfed.org/apikeys)
2. Create a free API key
3. Generate an API key
4. Add to `.env.local`:

```env
NEXT_PUBLIC_FRED_API_KEY=your_fred_api_key
```

### 🗺️ Google Maps Integration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable Maps JavaScript API
3. Generate API credentials with appropriate restrictions
4. Add to `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key
```

### � Supabase Setup (Optional)

1. Create an account at [Supabase](https://supabase.com/)
2. Create a new project
3. Get your API credentials
4. Configure in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 📊 Data Sources & Analytics

### **Economic Indicators (FRED API)**
- **S&P Case-Shiller Home Price Index** - Tracks changes in residential real estate prices
- **30-Year Fixed Rate Mortgage Average** - Current mortgage rates and historical trends
- **Housing Starts** - New housing construction projects initiated
- **Existing Home Sales** - Volume of home resales in the market

### **Property Data**
- Curated listings with detailed specifications
- Historical price data for comparative analysis
- Neighborhood statistics and amenity scores
- Investment potential calculations

## � Advanced Features

### **Property Comparison Tool**
Compare up to 4 properties side-by-side with detailed metrics:
- Price per square foot
- Investment potential score
- Neighborhood amenity ratings
- Historical price appreciation

### **Virtual Tour Scheduling**
Schedule property viewings directly through the platform with:
- Real-time availability calendar
- Agent contact information
- Automated reminders
- Tour preference settings

### **Interactive Onboarding Experience**
Guided tour of the platform with:
- Personalized recommendations based on preferences
- Feature highlights and usage tips
- Contextual help throughout the application

## 🧠 Smart Features

- **Predictive Search** - Anticipates user search intentions
- **Market Trend Alerts** - Notifications for significant market changes
- **Personalized Recommendations** - Based on browsing and search history
- **Favorites Synchronization** - Across devices with cloud storage

## 💻 Project Structure

```
EstateHub/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React context providers
│   ├── lib/              # Core utilities and configurations
│   └── utils/            # Helper functions and APIs
├── public/               # Static assets and images
├── lib/                  # Shared libraries
└── config files          # Next.js and TypeScript configuration
```

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Connect your GitHub repository to [Vercel](https://vercel.com)
2. Configure environment variables
3. Deploy with automatic CI/CD pipeline
4. Access analytics and monitoring tools

### Alternative Deployment Options
- **Netlify**: Similar workflow to Vercel with continuous deployment
- **AWS Amplify**: For enterprise-grade hosting with additional AWS services
- **Docker**: Containerized deployment for custom hosting solutions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## � License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🌟 About This Project

EstateHub was developed to demonstrate modern web development practices using Next.js, React, and powerful APIs. The platform combines real economic data with an intuitive interface to create a comprehensive real estate experience.

**Created with ❤️ by [Sunayana](https://github.com/Sunayana225)**

---

**Note**: While the application uses real economic data from FRED API, property listings are simulated for demonstration purposes. For production use, ensure proper data validation, error handling, and security measures.
