"use client";
import ProtectedRoute from "../providers/ProtectedRoute";
import { useAuth } from "../providers/AuthProvider";
import MapWrapper from "../components/MapWrapper";
import LocationFilters from "../components/LocationFilters";
import LocationListButton from "../components/LocationListButton";
import Navigation from "../components/Navigation";
import { useState, useEffect, useRef } from "react";
import { getFavourites, getLocations } from "../utils/apis/location";
import { getCurrentLocation } from "../utils/apis/user";
import FloatingSearchBar from "../components/FloatingSearchBar";
import { useSearchParams } from 'next/navigation'
import LocationDetailsPanel from "../components/LocationDetailsPanel";

interface Location {
  _id: string;
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    name?: string;
    amenity?: string;
    [key: string]: any;
  };
  address?: {
    street?: string;
    housenumber?: string;
    postcode?: string;
    city?: string;
    country?: string;
  };
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const searchParams = useSearchParams()
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<
    string | undefined
  >(undefined);
  const [userSavedLocation, setUserSavedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showNearbyUsers, setShowNearbyUsers] = useState(false);
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

  // Reference to the MapWrapper component to center on location
  const mapWrapperRef = useRef<{
    centerOnLocation: (lat: number, lng: number) => void;
  } | null>(null);

  const [filtersOpen, setFiltersOpen] = useState(false);

  // Load user's saved location on login
  useEffect(() => {
    const loadUserLocation = async () => {
      try {
        const savedLocation = await getCurrentLocation();
        if (savedLocation) {
          setUserSavedLocation({
            latitude: savedLocation.latitude,
            longitude: savedLocation.longitude
          });
        }
      } catch (error) {
        console.error('Failed to load user location:', error);
      }
    };

    if (user) {
      loadUserLocation();
    }
    const locationId = searchParams.get('locationId')
    if (locationId) {
      setSelectedLocationId(locationId)
    }
  }, [user, searchParams]);

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
    console.log(res, "jj");
    const favIds = res.map((fav: any) => fav._id);
    console.log(favIds, "jjn");
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

  const handleLocationSelect = (location: Location) => {
    // Center the map on the selected location
    if (mapWrapperRef.current?.centerOnLocation) {
      const [lng, lat] = location.geometry.coordinates;
      mapWrapperRef.current.centerOnLocation(lat, lng);
      setSelectedLocationId(location?._id)
    }
  };

  const handleCloseDetails = () => {
    setSelectedLocationId(undefined);
  };

  return (
    <ProtectedRoute>
      <div className="relative h-screen w-screen bg-gray-50 overflow-hidden">
        {/* Navigation Bar */}
        <Navigation isAuthenticated={true} />
        {/* Full-Screen Map */}
        <div className="absolute inset-0 z-0">
          <MapWrapper
            ref={mapWrapperRef}
            initialLocationId={selectedLocationId}
            locations={locations}
            favorites={favorites}
            setFavorites={setFavorites}
            onLocationChange={handleLocationChange}
            userSavedLocation={userSavedLocation}
            showNearbyUsers={showNearbyUsers}
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
            {/* <div className="card p-4 mt-4">
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
            </div> */}
          </div>
        )}

        {/* Nearby Users Toggle Button */}
        <div className="fixed top-50 right-4 z-20">
          <button
            onClick={() => setShowNearbyUsers(!showNearbyUsers)}
            className={`px-4 py-2 rounded-lg shadow-lg transition-all duration-200 ${
              showNearbyUsers
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            title={showNearbyUsers ? 'Hide nearby users' : 'Show nearby users'}
          >
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-1.7 2.26A6.003 6.003 0 0 0 12 16c-1.66 0-3.14-.68-4.22-1.78L5.29 13.29c-.63-.63-.19-1.71.7-1.71H9c.55 0 1-.45 1-1V7c0-.55-.45-1-1-1H6c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h1.5l1.5 2.25V21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-6h1.5l2.5 6H20z"/>
              </svg>
              <span className="text-sm font-medium">
                {showNearbyUsers ? 'Hide Users' : 'Nearby Users'}
              </span>
            </div>
          </button>
        </div>

        {/* Location List Button */}
        <LocationListButton
        setLocations={setLocations}
          locations={locations}
          favorites={favorites}
          setFavorites={setFavorites}
          onLocationSelect={handleLocationSelect}
        />

        {selectedLocationId && (
          <LocationDetailsPanel
            locationId={selectedLocationId}
            onClose={handleCloseDetails}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
