"use client";
import { useState, useEffect } from 'react';
import { getLocations } from '../utils/apis/location';

interface LocationDetailsPanelProps {
  locationId: string;
  onClose: () => void;
}

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

export default function LocationDetailsPanel({ locationId, onClose }: LocationDetailsPanelProps) {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        setLoading(true);
        const locations = await getLocations();
        const foundLocation = locations.find((loc: Location) => loc._id === locationId);
        setLocation(foundLocation || null);
      } catch (error) {
        console.error('Error fetching location details:', error);
        setLocation(null);
      } finally {
        setLoading(false);
      }
    };

    if (locationId) {
      fetchLocationDetails();
    }
  }, [locationId]);

  if (loading) {
    return (
      <div className="fixed z-30 w-full sm:w-80 left-0 sm:left-auto right-0 sm:right-6 bottom-0 sm:top-20 bg-white rounded-t-xl sm:rounded-lg shadow-xl border border-gray-200 p-4 sm:p-6 max-h-[70vh] sm:max-h-[calc(100vh-120px)] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Location Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="fixed z-30 w-full sm:w-80 left-0 sm:left-auto right-0 sm:right-6 bottom-0 sm:top-20 bg-white rounded-t-xl sm:rounded-lg shadow-xl border border-gray-200 p-4 sm:p-6 max-h-[70vh] sm:max-h-[calc(100vh-120px)] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Location Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-gray-500">Location not found</p>
      </div>
    );
  }

  const [lng, lat] = location.geometry.coordinates;

  return (
    <div className="fixed z-30 w-full sm:w-80 left-0 sm:left-auto right-0 sm:right-6 bottom-0 sm:top-20 bg-white rounded-t-xl sm:rounded-lg shadow-xl border border-gray-200 p-4 sm:p-6 max-h-[70vh] sm:max-h-[calc(100vh-120px)] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Location Details</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {/* Name */}
        {location.properties.name && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Name</h3>
            <p className="text-gray-900">{location.properties.name}</p>
          </div>
        )}

        {/* Amenity Type */}
        {location.properties.amenity && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Type</h3>
            <p className="text-gray-900 capitalize">{location.properties.amenity.replace('_', ' ')}</p>
          </div>
        )}

        {/* Coordinates */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">Coordinates</h3>
          <p className="text-gray-900 text-sm">
            {lat.toFixed(6)}, {lng.toFixed(6)}
          </p>
        </div>

        {/* Address */}
        {location.address && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Address</h3>
            <div className="text-gray-900 text-sm space-y-1">
              {location.address.street && location.address.housenumber && (
                <p>{location.address.street} {location.address.housenumber}</p>
              )}
              {location.address.postcode && location.address.city && (
                <p>{location.address.postcode} {location.address.city}</p>
              )}
              {location.address.country && <p>{location.address.country}</p>}
            </div>
          </div>
        )}

        {/* Additional Properties */}
        {Object.entries(location.properties).map(([key, value]) => {
          if (key !== 'name' && key !== 'amenity' && value) {
            return (
              <div key={key}>
                <h3 className="text-sm font-medium text-gray-700 mb-1 capitalize">
                  {key.replace('_', ' ')}
                </h3>
                <p className="text-gray-900 text-sm">{String(value)}</p>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
} 