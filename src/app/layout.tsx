import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { TourProvider } from "@/contexts/TourContext";
import OnboardingTour from "@/components/OnboardingTour";
import TourLauncher from "@/components/TourLauncher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EstateHub - Premium Real Estate Platform",
  description: "Find your dream property or list your real estate with EstateHub. Comprehensive market analytics and seamless property management.",
  keywords: "real estate, property, buy, sell, rent, market analytics, property management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <FavoritesProvider>
            <ComparisonProvider>
              <TourProvider>
                <Navigation />
                <main className="min-h-screen">
                  {children}
                </main>
                <Footer />
                <OnboardingTour />
                <TourLauncher />
              </TourProvider>
            </ComparisonProvider>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
