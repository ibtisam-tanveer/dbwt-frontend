"use client";

import { useState, useEffect } from "react";
import {
  getLocationByAmenity,
  getLocationByName,
  getLocations,
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
    return searchTerm || amenityFilter ? true : false;
  };
  const clearAll = async () => {
    const res = await getLocations();
    setLocations(res);
    setAmenityFilter("");
    setSearchTerm("");
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
      {/* Search Input */}
      <div>
        <label
          htmlFor="search"
          className="block text-sm font-medium text-black mb-1"
        >
          Search Locations
        </label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name."
          className=" text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Amenity Filter */}
      <div>
        <label
          htmlFor="amenity"
          className="block text-sm font-medium text-black mb-1"
        >
          Filter by Amenity
        </label>
        <select
          id="amenity"
          value={amenityFilter}
          onChange={(e) => setAmenityFilter(e.target.value)}
          className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Types</option>
          {filterData?.map((amenity) => (
            <option key={amenity} value={amenity}>
              {amenity}
            </option>
          ))}
        </select>
      </div>
      {showClearButton() && (
        <button
          onClick={clearAll}
          className="cursor-pointer inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
        >
          Clear All
        </button>
      )}
      {loading && <div className="text-sm text-gray-500">Loading...</div>}
    </div>
  );
}
