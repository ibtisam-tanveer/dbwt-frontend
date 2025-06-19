"use client";
import ProtectedRoute from "../providers/ProtectedRoute";
import { useAuth } from "../providers/AuthProvider";
import MapWrapper from "../components/MapWrapper";
import LocationFilters from "../components/LocationFilters";
import Navigation from "../components/Navigation";
import { useState, useEffect, useRef } from "react";
import { getFavourites, getLocations } from "../utils/apis/location";
import FloatingSearchBar from "../components/FloatingSearchBar";

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

  // Reference to the LocationFilters component to update location
  const locationFiltersRef = useRef<{
    updateLocation: (lat: number, lng: number) => void;
  } | null>(null);

  const [filtersOpen, setFiltersOpen] = useState(false);

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

  // const handleFavoriteToggle = (locationId: string) => {
  //   setFavorites((prev) => {
  //     const newFavorites = prev.includes(id)
  //       ? prev.filter((id) => id !== id)
  //       : [...prev, locationId];

  //     console.log(newFavorites);
  //     return newFavorites;
  //   });
  // };
  const getLoggedUserFav = async () => {
    const res = await getFavourites();
    const favIds = res.map((fav: any) => fav._id);
    setFavorites(favIds);
    // console.log(res[0]._id,'kk');
  };
  useEffect(() => {
    getLoggedUserFav();
  }, []);
  const handleLocationChange = (lat: number, lng: number) => {
    console.log("Location changed to:", lat, lng);

    // Update the location in the filters component
    if (locationFiltersRef.current?.updateLocation) {
      locationFiltersRef.current.updateLocation(lat, lng);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query) {
      // If search is cleared, show all locations
      const all = await getLocations();
      setLocations(all);
      return;
    }
    // Search by name or amenity
    const byName = await getLocations();
    const filtered = byName.filter(
      (loc: any) =>
        (loc.properties.name &&
          loc.properties.name.toLowerCase().includes(query.toLowerCase())) ||
        (loc.properties.amenity &&
          loc.properties.amenity.toLowerCase().includes(query.toLowerCase()))
    );
    setLocations(filtered);
  };

  return (
    <ProtectedRoute>
      <div className="relative h-screen w-screen bg-gray-50 overflow-hidden">
        {/* Navigation Bar */}
        <Navigation isAuthenticated={true} />
        {/* Full-Screen Map */}
        <div className="absolute inset-0 z-0">
          <MapWrapper
            initialLocationId={selectedLocationId}
            locations={locations}
            favorites={favorites}
            setFavorites={setFavorites}
            onLocationChange={handleLocationChange}
          />
        </div>
        {/* Floating Search Bar */}
        {!filtersOpen && (
          <FloatingSearchBar
            onSearch={handleSearch}
            onFilterClick={() => setFiltersOpen((v) => !v)}
            onLocationClick={() => {
              // Center map on user location (simulate click on FAB)
              // You can wire this to MapWrapper/Map via a ref if needed
              window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }}
          />
        )}
        {/* Floating Filters Panel (only when open) */}
        {filtersOpen && (
          <div className="fixed top-20 left-6 z-20 w-[340px] max-w-full">
            <LocationFilters
              ref={locationFiltersRef}
              setLocations={setLocations}
              favorites={favorites}
              onClose={() => setFiltersOpen(false)}
            />
            {/* Stats Card */}
            <div className="card p-4 mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Quick Stats
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total locations</span>
                  <span className="font-medium text-gray-900">
                    {locations.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Favorites</span>
                  <span className="font-medium text-gray-900">
                    {favorites.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Types</span>
                  <span className="font-medium text-gray-900">
                    {
                      Array.from(
                        new Set(
                          locations
                            .map((loc) => loc.properties.amenity)
                            .filter(Boolean)
                        )
                      ).length
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Floating Action Buttons (FABs) placeholder */}
        <div className="fixed bottom-8 right-8 z-30 flex flex-col items-end space-y-4">
          {/* FABs will be added in Map.tsx for map-related actions */}
        </div>
      </div>
    </ProtectedRoute>
  );
}
