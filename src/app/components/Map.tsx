"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { useEffect, useState } from "react";
import { toggleFavourites } from "../utils/apis/location";

// Custom icons with better styling
const defaultIcon = new Icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IiM0Mjg1RjQiLz4KPHBhdGggZD0iTTEyIDZDNi40OCA2IDIgMTAuNDggMiAxNkMyIDIxLjUyIDYuNDggMjYgMTIgMjZDMjEuNTIgMjYgMjYgMjEuNTIgMjYgMTZDMjYgMTAuNDggMjEuNTIgNiAxMiA2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEyIDEwQzE0LjIwOTEgMTAgMTYgMTEuNzkwOSAxNiAxNEMxNiAxNi4yMDkxIDE0LjIwOTEgMTggMTIgMThDOS43OTA5IDE4IDggMTYuMjA5MSA4IDE0QzggMTEuNzkwOSA5Ljc5MDkgMTAgMTIgMTBaIiBmaWxsPSIjNDI4NUY0Ii8+Cjwvc3ZnPgo=",
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

const favoriteIcon = new Icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IiNFQTRDMzUiLz4KPHBhdGggZD0iTTEyIDZDNi40OCA2IDIgMTAuNDggMiAxNkMyIDIxLjUyIDYuNDggMjYgMTIgMjZDMjEuNTIgMjYgMjYgMjEuNTIgMjYgMTZDMjYgMTAuNDggMjEuNTIgNiAxMiA2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEyIDEwQzE0LjIwOTEgMTAgMTYgMTEuNzkwOSAxNiAxNEMxNiAxNi4yMDkxIDE0LjIwOTEgMTggMTIgMThDOS43OTA5IDE4IDggMTYuMjA5MSA4IDE0QzggMTEuNzkwOSA5Ljc5MDkgMTAgMTIgMTBaIiBmaWxsPSIjRUE0QzM1Ii8+Cjwvc3ZnPgo=",
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

const currentLocationIcon = new Icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IiMzNEE4NTMiLz4KPHBhdGggZD0iTTEyIDZDNi40OCA2IDIgMTAuNDggMiAxNkMyIDIxLjUyIDYuNDggMjYgMTIgMjZDMjEuNTIgMjYgMjYgMjEuNTIgMjYgMTZDMjYgMTAuNDggMjEuNTIgNiAxMiA2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEyIDEwQzE0LjIwOTEgMTAgMTYgMTEuNzkwOSAxNiAxNEMxNiAxNi4yMDkxIDE0LjIwOTEgMTggMTIgMThDOS43OTA5IDE4IDggMTYuMjA5MSA4IDE0QzggMTEuNzkwOSA5Ljc5MDkgMTAgMTIgMTBaIiBmaWxsPSIjMzRBODUzIi8+Cjwvc3ZnPgo=",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

// Amenity/category icon mapping
const amenityIcons: Record<string, Icon> = {
  restaurant: new Icon({
    iconUrl: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/geo-alt-fill.svg',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
    className: 'marker-icon-restaurant',
  }),
  cafe: new Icon({
    iconUrl: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/cup-straw.svg',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
    className: 'marker-icon-cafe',
  }),
  park: new Icon({
    iconUrl: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/tree-fill.svg',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
    className: 'marker-icon-park',
  }),
  // Add more categories as needed
};

interface Location {
  _id?: string;
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

interface MapProps {
  initialLocationId?: string;
  locations: Location[];
  favorites: string[];
  setFavorites: any;
  // onFavoriteToggle: (locationId: string) => void;
  onLocationChange?: (lat: number, lng: number) => void;
}

// Inner map controls component that can access the map context
function MapControlsInner({
  onCenterLocation,
}: {
  onCenterLocation: () => void;
}) {
  const map = useMap();

  return (
    <div className="absolute top-4 right-4 z-[1000] space-y-3">
      {/* My Location Button */}
      <button
        onClick={onCenterLocation}
        className="btn-icon w-12 h-12 flex items-center justify-center"
        title="Center on my location"
      >
        <svg
          className="w-5 h-5 text-gray-700"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      </button>

      {/* Zoom Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <button
          className="w-12 h-10 flex items-center justify-center border-b border-gray-200 hover:bg-gray-50 transition-colors"
          onClick={() => map.zoomIn()}
          title="Zoom in"
        >
          <svg
            className="w-4 h-4 text-gray-700"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </button>
        <button
          className="w-12 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
          onClick={() => map.zoomOut()}
          title="Zoom out"
        >
          <svg
            className="w-4 h-4 text-gray-700"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 13H5v-2h14v2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Component to handle map center updates
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

export default function Map({
  initialLocationId,
  locations,
  favorites,
  setFavorites,
  // onFavoriteToggle,
  onLocationChange,
}: MapProps) {
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]); // Default to London
  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [isDraggingLocation, setIsDraggingLocation] = useState(false);

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

  const handleLocationDragStart = () => {
    setIsDraggingLocation(true);
  };

  const handleLocationDragEnd = (event: any) => {
    const newPosition: [number, number] = [
      event.target.getLatLng().lat,
      event.target.getLatLng().lng,
    ];

    setCurrentLocation(newPosition);
    setPosition(newPosition);
    setIsDraggingLocation(false);

    // Notify parent component about location change
    if (onLocationChange) {
      onLocationChange(newPosition[0], newPosition[1]);
    }
  };

  useEffect(() => {
    // If we have an initialLocationId, find and center on that location
    if (initialLocationId) {
      const location = locations.find((loc) => loc._id === initialLocationId);
      if (location && location.geometry.type === "Point") {
        setSelectedLocation(location);
        setPosition([
          location.geometry.coordinates[1],
          location.geometry.coordinates[0],
        ]);
      }
    } else {
      // If no initial location, get user's current position
      getCurrentLocation();
    }
  }, [initialLocationId, locations]);

  const getLocationName = (location: Location): string => {
    if (location.properties.name) return location.properties.name;
    if (location.properties.amenity) return location.properties.amenity;
    if (location.address?.street) {
      return `${location.address.street}${
        location.address.housenumber ? ` ${location.address.housenumber}` : ""
      }`;
    }
    return "Unnamed Location";
  };

  const getLocationDetails = (location: Location): string => {
    const details = [];
    if (location.address?.city) details.push(location.address.city);
    if (location.address?.postcode) details.push(location.address.postcode);
    if (location.properties.amenity) details.push(location.properties.amenity);
    return details.join(", ");
  };

  const handleFavorite = async (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((item) => item !== id));
    } else {
      setFavorites([...favorites, id]);
    }
    const result =await toggleFavourites(id)
  };
  return (
    <div className="h-full w-full relative map-container">
      {error && (
        <div className="absolute top-4 left-4 right-4 z-[1002] bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-sm">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">{error}</span>
            <button
              onClick={getCurrentLocation}
              className="ml-auto text-red-600 hover:text-red-800 underline text-sm"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-[1001]">
          <div className="text-center">
            <div className="loading-spinner h-8 w-8 mx-auto mb-3"></div>
            <p className="text-gray-600 text-sm font-medium">
              Getting your location...
            </p>
          </div>
        </div>
      )}

      {/* Dragging indicator */}
      {isDraggingLocation && (
        <div className="absolute top-4 left-4 z-[1002] bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg shadow-sm">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">
              Drag to move your location
            </span>
          </div>
        </div>
      )}

      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Current Location Marker - Draggable */}
        {currentLocation && (
          <Marker
            position={currentLocation}
            icon={currentLocationIcon}
            draggable={true}
            eventHandlers={{
              dragstart: handleLocationDragStart,
              dragend: handleLocationDragEnd,
            }}
          >
            <Popup>
              <div className="p-3 min-w-[200px]">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <h3 className="font-semibold text-gray-900">
                    Your Current Location
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Lat: {currentLocation[0].toFixed(6)}
                </p>
                <p className="text-sm text-gray-600">
                  Lng: {currentLocation[1].toFixed(6)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Drag this marker to change your location
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Location Markers */}
        {locations.map(
          (location, index) =>
            location.geometry.type === "Point" && (
              <Marker
                key={location._id || index}
                position={[
                  location.geometry.coordinates[1],
                  location.geometry.coordinates[0],
                ]}
                icon={
                  favorites.includes(location._id || "")
                    ? favoriteIcon
                    : (amenityIcons[location.properties.amenity || ''] || defaultIcon)
                }
              >
                <Popup>
                  <div className="p-3 min-w-[250px]">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900 text-base">
                        {getLocationName(location)}
                      </h3>
                      <button
                        onClick={() => handleFavorite(location._id)}
                        className="text-gray-400 hover:text-red-500 focus:outline-none transition-colors"
                        title={
                          favorites.includes(location._id || "")
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        <svg
                          className="w-5 h-5"
                          fill={
                            favorites.includes(location._id || "")
                              ? "red"
                              : "none"
                          }
                          stroke={
                            favorites.includes(location._id || "")
                              ? "red"
                              : "black"
                          }
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {getLocationDetails(location)}
                    </p>
                    {location.address?.street && (
                      <div className="text-xs text-gray-500">
                        📍 {location.address.street}
                        {location.address.housenumber &&
                          ` ${location.address.housenumber}`}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            )
        )}

        <MapUpdater center={position} />
        <MapControlsInner onCenterLocation={getCurrentLocation} />
      </MapContainer>

      {/* Floating Action Buttons (FABs) */}
      <div className="fixed bottom-8 right-8 z-[1100] flex flex-col items-end space-y-4">
        <button
          onClick={getCurrentLocation}
          className="btn-icon w-14 h-14 flex items-center justify-center shadow-lg"
          title="Center on my location"
        >
          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </button>
        {/* Add more FABs here, e.g., for filters, legend, etc. */}
      </div>
    </div>
  );
}
