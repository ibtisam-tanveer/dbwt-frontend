"use client";

import React, { useState, useEffect } from "react";
import {
  getFavourites,
  getLocationByName,
  getLocations,
  toggleFavourites,
} from "../utils/apis/location";

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

interface LocationListButtonProps {
  locations: Location[];
  favorites: string[];
  setFavorites: React.Dispatch<React.SetStateAction<string[]>>;
  onLocationSelect?: (location: Location) => void;
  setLocations: any;
}

export default function LocationListButton({
  locations,
  favorites,
  setFavorites,
  onLocationSelect,
  setLocations,
}: LocationListButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredLocations, setFilteredLocations] =
    useState<Location[]>(locations);
  const [searchTerm, setSearchTerm] = useState("");
  const [amenityFilter, setAmenityFilter] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "distance" | "type">("name");

  // Get unique amenity types for filter dropdown
  const amenityTypes = Array.from(
    new Set(
      locations
        .map((loc) => loc.properties.amenity)
        .filter(Boolean)
        .sort()
    )
  );

  // Filter and sort locations
  // useEffect(() => {
  //   let filtered = [...locations];

  //   // Filter by search term
  //   if (searchTerm) {
  //     filtered = filtered.filter(
  //       (loc) =>
  //         (loc.properties.name &&
  //           loc.properties.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
  //         (loc.properties.amenity &&
  //           loc.properties.amenity.toLowerCase().includes(searchTerm.toLowerCase()))
  //     );
  //   }

  //   // Filter by amenity type
  //   if (amenityFilter) {
  //     filtered = filtered.filter(
  //       (loc) => loc.properties.amenity === amenityFilter
  //     );
  //   }

  //   // Filter by favorites only
  // if (showFavoritesOnly) {
  //     const filtered = ge;
  //    }

  useEffect(() => {
    const fetchFavLocations = async () => {
      try {
        setLoading(true);

        if (showFavoritesOnly) {
          const res = await getFavourites();
          setLocations(res);
          console.log(res, "dddd");
        } else {
          const allLoc = await getLocations();
          setLocations(allLoc);
        }
      } catch (error) {
        console.error("Error fetching filtered locations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavLocations()
  }, [showFavoritesOnly]);
  //   // Sort locations
  //   filtered.sort((a, b) => {
  //     switch (sortBy) {
  //       case "name":
  //         const nameA = a.properties.name || a.properties.amenity || "";
  //         const nameB = b.properties.name || b.properties.amenity || "";
  //         return nameA.localeCompare(nameB);
  //       case "type":
  //         const typeA = a.properties.amenity || "";
  //         const typeB = b.properties.amenity || "";
  //         return typeA.localeCompare(typeB);
  //       case "distance":
  //         // For now, just sort by name since we don't have distance calculation
  //         const distNameA = a.properties.name || a.properties.amenity || "";
  //         const distNameB = b.properties.name || b.properties.amenity || "";
  //         return distNameA.localeCompare(distNameB);
  //       default:
  //         return 0;
  //     }
  //   });

  //   setFilteredLocations(filtered);
  // }, [locations, searchTerm, amenityFilter, showFavoritesOnly, sortBy, favorites]);
  useEffect(() => {
    const fetchFilteredLocations = async () => {
      try {
        setLoading(true);

        if (searchTerm) {
          const res = await getLocationByName(searchTerm);
          setLocations(res);
          console.log(res, "dddd");
        } else {
          const allLoc = await getLocations();
          setLocations(allLoc);
        }
      } catch (error) {
        console.error("Error fetching filtered locations:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(fetchFilteredLocations, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleFavoriteToggle = async (locationId: string) => {
    try {
      await toggleFavourites(locationId);
      setFavorites((prev: string[]) => {
        const newFavorites = prev.includes(locationId)
          ? prev.filter((id: string) => id !== locationId)
          : [...prev, locationId];
        return newFavorites;
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const getLocationName = (location: Location): string => {
    return (
      location.properties.name ||
      location.properties.amenity ||
      "Unnamed Location"
    );
  };

  const getLocationDetails = (location: Location): string => {
    const details = [];
    if (location.properties.amenity) {
      details.push(location.properties.amenity);
    }
    if (location.address?.street) {
      details.push(location.address.street);
    }
    if (location.address?.city) {
      details.push(location.address.city);
    }
    return details.join(" • ");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setAmenityFilter("");
    setShowFavoritesOnly(false);
    setSortBy("name");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-8 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
        aria-label="Toggle location list"
      >
        {isOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Location List Panel */}
      {isOpen && (
        <div className="fixed bottom-40 right-8 z-40 w-80 max-h-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4">
            <h3 className="text-lg font-semibold">Locations</h3>
            <p className="text-sm opacity-90">
              {filteredLocations.length} of {locations.length} locations
            </p>
          </div>

          {/* Search and Filters */}
          <div className="p-4 border-b border-gray-200 space-y-3">
            {/* Search */}
            {/* <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className=" text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            /> */}

            {/* Toggle Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  showFavoritesOnly
                    ? "bg-red-100 text-red-700 border border-red-300"
                    : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                }`}
              >
                {showFavoritesOnly
                  ? "Showing Favorites"
                  : "Show Favorites Only"}
              </button>

              {showFavoritesOnly && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-200 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Location List */}
          <div className="max-h-64 overflow-y-auto">
            {locations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No locations found
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {locations.map((location) => (
                  <div
                    key={location._id}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onLocationSelect?.(location)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {getLocationName(location)}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {getLocationDetails(location)}
                        </p>
                        {location.properties.amenity && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {location.properties.amenity}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavoriteToggle(location._id);
                        }}
                        className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <svg
                          className={`w-5 h-5 ${
                            favorites.includes(location._id)
                              ? "text-red-500 fill-current"
                              : "text-gray-400 hover:text-red-500"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
