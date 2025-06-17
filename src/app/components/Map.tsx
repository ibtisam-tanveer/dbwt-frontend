"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { useEffect, useState } from "react";

// Custom icons
const defaultIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const favoriteIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const currentLocationIcon = new Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  iconSize: [30, 46],
  iconAnchor: [15, 46],
});

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
  onFavoriteToggle: (locationId: string) => void;
}

// Component to handle map controls
function MapControls({ onCenterLocation }: { onCenterLocation: () => void }) {
  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <button
        onClick={onCenterLocation}
        className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded shadow-lg border border-gray-300 transition-colors duration-200"
        title="Center on my location"
      >
        📍 My Location
      </button>
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
  onFavoriteToggle,
}: MapProps) {
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]); // Default to London
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

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
          setError("Unable to get your current location. Please check your location permissions.");
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

  return (
    <div className="h-[500px] w-full relative">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button
            onClick={getCurrentLocation}
            className="ml-2 text-red-700 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}
      
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-[1001]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Getting your location...</p>
          </div>
        </div>
      )}

      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Current Location Marker */}
        {currentLocation && (
          <Marker position={currentLocation} icon={currentLocationIcon}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-blue-600">📍 Your Current Location</h3>
                <p className="text-sm text-gray-600">
                  Lat: {currentLocation[0].toFixed(6)}, Lng: {currentLocation[1].toFixed(6)}
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
                    : defaultIcon
                }
              >
                <Popup>
                  <div className="p-2">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">{getLocationName(location)}</h3>
                      <button
                        onClick={() => onFavoriteToggle(location._id || "")}
                        className="text-gray-500 hover:text-red-500 focus:outline-none"
                      >
                        {favorites.includes(location._id || "") ? "★" : "☆"}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      {getLocationDetails(location)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )
        )}
        
        <MapUpdater center={position} />
      </MapContainer>
      
      <MapControls onCenterLocation={getCurrentLocation} />
    </div>
  );
}
