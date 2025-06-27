'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './providers/AuthProvider';
import Link from 'next/link';
import Navigation from './components/Navigation';

export default function Home() {
  const { token } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      router.replace('/dashboard');
    } else {
      setIsLoading(false);
    }
  }, [token, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner h-8 w-8 mx-auto mb-3"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-50 to-yellow-50 relative overflow-hidden">
      {/* Animated Glowing Shapes */}
      <div className="absolute top-[-60px] left-[-60px] w-72 h-72 rounded-full bg-glow-blue glow-shape z-0 animated-float" />
      <div className="absolute bottom-[-80px] right-[-80px] w-96 h-96 rounded-full bg-glow-pink glow-shape z-0 animated-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 w-40 h-40 rounded-full bg-glow-yellow glow-shape z-0 animated-float" style={{ animationDelay: '1s' }} />

      {/* Navigation */}
      <Navigation isAuthenticated={!!token} />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[60vh] pt-32 pb-16 z-10">
        <div className="max-w-3xl w-full px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 animated-fadeInUp drop-shadow-lg">
            Discover <span className="text-blue-600">Cool Places</span>
            <br /> Around <span className="text-pink-500">You</span>
          </h1>
          <p className="text-2xl text-gray-700 mb-10 animated-fadeIn" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            Explore, search, and save your favorite spots with a playful, interactive map experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animated-fadeIn" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <Link href="/signup" className="btn-primary text-lg px-8 py-4 shadow-xl">
              Start Exploring
            </Link>
            <Link href="/login" className="btn-secondary text-lg px-8 py-4 shadow-xl">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animated-fadeInUp">Awesome Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animated-fadeIn" style={{ animationDelay: '0.2s' }}>
              Everything you need to explore and manage locations in style.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Feature Cards */}
            <div className="glass-card p-8 text-center animated-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-blue-100 rounded-full shadow-lg animated-float">
                <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Maps</h3>
              <p className="text-gray-600">Zoom, pan, and discover places around you with a beautiful map interface.</p>
            </div>
            <div className="glass-card p-8 text-center animated-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-pink-100 rounded-full shadow-lg animated-float">
                <svg className="w-10 h-10 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Favorites Management</h3>
              <p className="text-gray-600">Save and organize your favorite locations for quick access anytime.</p>
            </div>
            <div className="glass-card p-8 text-center animated-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-yellow-100 rounded-full shadow-lg animated-float">
                <svg className="w-10 h-10 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Search</h3>
              <p className="text-gray-600">Find locations by name, type, or proximity with advanced filters.</p>
            </div>
            <div className="glass-card p-8 text-center animated-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-green-100 rounded-full shadow-lg animated-float">
                <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Location</h3>
              <p className="text-gray-600">Get your current location and find nearby places instantly.</p>
            </div>
            <div className="glass-card p-8 text-center animated-fadeInUp" style={{ animationDelay: '0.5s' }}>
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-purple-100 rounded-full shadow-lg animated-float">
                <svg className="w-10 h-10 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">Your data is protected with modern security and privacy-first design.</p>
            </div>
            <div className="glass-card p-8 text-center animated-fadeInUp" style={{ animationDelay: '0.6s' }}>
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-red-100 rounded-full shadow-lg animated-float">
                <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Responsive Design</h3>
              <p className="text-gray-600">Works perfectly on all devices. Mobile-friendly and beautiful.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 z-10 relative">
        {/* Confetti/Sparkles Effect */}
        <div className="pointer-events-none absolute inset-0 flex justify-center items-center z-0">
          {/* Sparkles (SVG or emoji) */}
          <div className="absolute left-1/4 top-8 text-4xl animate-pulse select-none">✨</div>
          <div className="absolute right-1/4 top-16 text-3xl animate-bounce select-none">🎉</div>
          <div className="absolute left-1/3 bottom-10 text-2xl animate-pulse select-none">🌟</div>
          <div className="absolute right-1/3 bottom-16 text-4xl animate-bounce select-none">💫</div>
        </div>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card bg-gradient-to-tr from-blue-200 via-pink-100 to-yellow-100 shadow-2xl p-12 text-center relative animated-fadeInUp">
            <div className="flex justify-center mb-4">
              <svg className="w-16 h-16 text-pink-400 drop-shadow-lg animated-float" fill="none" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="#f472b6" opacity="0.2" />
                <path d="M32 12l6.928 14.142L54 28.284l-11.036 10.928L44.856 52 32 44.856 19.144 52l1.892-12.788L10 28.284l15.072-2.142z" fill="#f472b6" />
              </svg>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight animated-fadeInUp">Join the Adventure!</h2>
            <p className="text-lg md:text-2xl text-gray-700 mb-8 animated-fadeIn" style={{ animationDelay: '0.2s' }}>
              Be part of a vibrant community discovering amazing places. <br className="hidden md:inline" />Sign up now and let the journey begin!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animated-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <Link href="/signup" className="btn-primary text-xl px-10 py-4 shadow-xl transform hover:scale-105 transition-transform duration-200">
                <span role="img" aria-label="party popper" className="mr-2">🎊</span> Create Account
              </Link>
              <Link href="/login" className="btn-secondary text-xl px-10 py-4 shadow-xl transform hover:scale-105 transition-transform duration-200">
                <span role="img" aria-label="rocket" className="mr-2">🚀</span> Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <h3 className="text-xl font-semibold">Chemnitz explorer</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Discover Chemnitz with our interactive map platform. 
                Find places, save favorites, and explore with confidence.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/signup" className="text-gray-400 hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">Interactive Maps</li>
                <li className="text-gray-400">Location Search</li>
                <li className="text-gray-400">Favorites</li>
                <li className="text-gray-400">Real-time Location</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Chemnitz explorer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
