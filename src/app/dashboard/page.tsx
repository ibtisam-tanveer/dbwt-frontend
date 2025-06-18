"use client";
import ProtectedRoute from "../providers/ProtectedRoute";
import { useAuth } from "../providers/AuthProvider";
import MapWrapper from "../components/MapWrapper";
import LocationFilters from "../components/LocationFilters";
import Navigation from "../components/Navigation";
import { useState, useEffect } from "react";
import { getLocations } from "../utils/apis/location";

interface Location {
  _id: string;
  properties: {
    name?: string;
    amenity?: string;
  };
  address?: {
    street?: string;
    city?: string;
  };
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<
    string | undefined
  >();
  const [favorites, setFavorites] = useState<string[]>(() => {
    // Load favorites from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("favoriteLocations");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await getLocations();
        console.log(response, "rrr");

        setLocations(response);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  const handleFavoriteToggle = (locationId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(locationId)
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId];
      
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("favoriteLocations", JSON.stringify(newFavorites));
      }
      
      return newFavorites;
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Enhanced Navigation Bar */}
        <Navigation isAuthenticated={true} />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <LocationFilters
                  setLocations={setLocations}
                  favorites={favorites}
                />
                
                {/* Stats Card */}
                <div className="card p-4 mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Stats</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total locations</span>
                      <span className="font-medium text-gray-900">{locations.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Favorites</span>
                      <span className="font-medium text-gray-900">{favorites.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Types</span>
                      <span className="font-medium text-gray-900">
                        {Array.from(new Set(locations.map(loc => loc.properties.amenity).filter(Boolean))).length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="lg:col-span-3">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Interactive Map
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Explore locations, find nearby places, and manage your favorites
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">Regular</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">Favorite</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">You</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-[700px] w-full rounded-lg overflow-hidden">
                  <MapWrapper
                    initialLocationId={selectedLocationId}
                    locations={locations}
                    favorites={favorites}
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
