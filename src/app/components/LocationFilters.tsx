"use client";

import { useState, useEffect } from "react";
import {
  getLocationByAmenity,
  getLocationByName,
  getLocations,
  getNearestLocations,
} from "../utils/apis/location";

interface LocationFiltersProps {
  favorites: string[];
  setLocations: any;
}

export default function LocationFilters({
  setLocations,
  favorites,
}: LocationFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [amenityFilter, setAmenityFilter] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >(null);
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]);
  const [distance, setDistance] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);

        const res = await getLocations();

        const filterArrayData = Array.from(
          new Set(res.map((loc: any) => loc.properties.amenity).filter(Boolean))
        );

        setFilterData(filterArrayData as any);
      } catch (error) {
        console.error("Error fetching filtered locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchFilteredLocations = async () => {
      try {
        setLoading(true);

        if (searchTerm) {
          const res = await getLocationByName(searchTerm);
          setLocations(res);
          console.log(res);
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

  useEffect(() => {
    const fetchFilteredLocations = async () => {
      try {
        setLoading(true);

        if (amenityFilter) {
          const res = await getLocationByAmenity(amenityFilter);
          setLocations(res);
          console.log(res);
        }
      } catch (error) {
        console.error("Error fetching filtered locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredLocations();
  }, [amenityFilter]);

  const showClearButton = () => {
    return searchTerm || amenityFilter || distance != -1 ? true : false;
  };

  const clearAll = async () => {
    const res = await getLocations();
    setLocations(res);
    setAmenityFilter("");
    setSearchTerm("");
    setDistance(-1)
  };

  const filterNearByLocations = async () => {
    const result = await getNearestLocations({
      lon: position[1],
      lat: position[0],
      distance: distance,
    });
    setLocations(result);
    console.log(result);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setCurrentLocation(newPosition);
          setPosition(newPosition);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError(
            "Unable to get your current location. Please check your location permissions."
          );
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    console.log("distance", distance);
    if (distance != -1) {
      filterNearByLocations();
    }
  }, [distance]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className="card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Search & Filters</h2>
        {showClearButton() && (
          <button
            onClick={clearAll}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="space-y-2">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700">
          Search locations
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name..."
            className="search-input pl-10"
          />
        </div>
      </div>

      {/* Amenity Filter */}
      <div className="space-y-2">
        <label htmlFor="amenity" className="block text-sm font-medium text-gray-700">
          Filter by type
        </label>
        <div className="relative">
          <select
            id="amenity"
            value={amenityFilter}
            onChange={(e) => setAmenityFilter(e.target.value)}
            className="search-input appearance-none pr-10"
          >
            <option value="">All types</option>
            {filterData?.map((amenity) => (
              <option key={amenity} value={amenity}>
                {amenity}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Distance Filter */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Distance from current location
          </label>
          {distance !== -1 && (
            <span className="text-sm font-medium text-blue-600">
              {distance} km
            </span>
          )}
        </div>
        
        <div className="space-y-3">
          <input
            type="range"
            min="1"
            max="10"
            value={distance === -1 ? 5 : distance}
            onChange={(e) => setDistance(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 km</span>
            <span>10 km</span>
          </div>
        </div>

        {distance === -1 && (
          <button
            onClick={() => setDistance(5)}
            className="btn-secondary w-full text-sm"
          >
            Enable distance filter
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="loading-spinner h-6 w-6 mr-2"></div>
          <span className="text-sm text-gray-600">Loading...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick actions</h3>
        <div className="space-y-2">
          <button
            onClick={getCurrentLocation}
            className="w-full btn-secondary text-sm flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Update my location
          </button>
          
          <button
            onClick={() => setDistance(5)}
            className="w-full btn-secondary text-sm flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Show nearby places
          </button>
        </div>
      </div>
    </div>
  );
}
