"use client";
import ProtectedRoute from "../providers/ProtectedRoute";
import { useAuth } from "../providers/AuthProvider";
import MapWrapper from "../components/MapWrapper";
import LocationFilters from "../components/LocationFilters";
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Welcome, {user?.fullName}</span>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <LocationFilters
                  setLocations={setLocations}
                  favorites={favorites}
                />
              </div>

              {/* Map Section */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Interactive Map
                  </h2>
                  <div className="h-[600px] w-full rounded-lg overflow-hidden">
                    <MapWrapper
                      initialLocationId={selectedLocationId}
                      locations={locations}
                      favorites={favorites}
                      onFavoriteToggle={() => console.log("hello")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
