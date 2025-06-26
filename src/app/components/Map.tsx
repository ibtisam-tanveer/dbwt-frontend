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
import { Icon, divIcon } from "leaflet";
import { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import { toggleFavourites } from "../utils/apis/location";
import { updateCurrentLocation, getNearbyUsers, NearbyUser } from "../utils/apis/user";
import { useRouter } from "next/navigation";

// Custom icons with better styling
const defaultIcon = new Icon({
  iconUrl:
    "data:image/svg+xml;utf8,<svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M20 2C12 2 6 8 6 16c0 8 14 22 14 22s14-14 14-22c0-8-6-14-14-14z' fill='blue' stroke='white' stroke-width='2'/><circle cx='20' cy='16' r='6' fill='white'/></svg>",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  className: "marker-icon-default-location",
});

const favoriteIcon = new Icon({
  iconUrl:
    "data:image/svg+xml;utf8,<svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='favGradient' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='%23FF5F6D'/><stop offset='100%' stop-color='%23FFC371'/></linearGradient></defs><path d='M20 2C12 2 6 8 6 16c0 8 14 22 14 22s14-14 14-22c0-8-6-14-14-14z' fill='url(%23favGradient)' stroke='white' stroke-width='2'/><circle cx='20' cy='16' r='6' fill='white'/></svg>",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  className: "marker-icon-favorite",
});

const currentLocationIcon = new Icon({
  iconUrl:
    "data:image/svg+xml;utf8,<svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M20 2C12 2 6 8 6 16c0 8 14 22 14 22s14-14 14-22c0-8-6-14-14-14z' fill='%234CAF50' stroke='white' stroke-width='2'/><circle cx='20' cy='16' r='6' fill='white'/></svg>",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  className: "marker-icon-current-location",
});

const userIcon = new Icon({
  iconUrl:
    "data:image/svg+xml;utf8,<svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='20' cy='20' r='18' fill='%236C63FF' stroke='white' stroke-width='2'/><circle cx='20' cy='16' r='6' fill='white'/><path d='M8 32c0-6.627 5.373-12 12-12s12 5.373 12 12' fill='white'/></svg>",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  className: "marker-icon-user",
});

// Amenity/category icon mapping
const amenityIcons: Record<string, Icon> = {
  restaurant: new Icon({
    iconUrl:
      "data:image/svg+xml;utf8,<svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M20 2C12 2 6 8 6 16c0 8 14 22 14 22s14-14 14-22c0-8-6-14-14-14z' fill='%23FF7043' stroke='white' stroke-width='2'/><circle cx='20' cy='16' r='6' fill='white'/></svg>",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: "marker-icon-restaurant",
  }),
  theatre: new Icon({
    iconUrl:
      "data:image/svg+xml;utf8,<svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M20 2C12 2 6 8 6 16c0 8 14 22 14 22s14-14 14-22c0-8-6-14-14-14z' fill='%238E24AA' stroke='white' stroke-width='2'/><circle cx='20' cy='16' r='6' fill='white'/></svg>",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: "marker-icon-theatre",
  }),
  bench: new Icon({
    iconUrl:
      "data:image/svg+xml;utf8,<svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M20 2C12 2 6 8 6 16c0 8 14 22 14 22s14-14 14-22c0-8-6-14-14-14z' fill='%238D6E63' stroke='white' stroke-width='2'/><circle cx='20' cy='16' r='6' fill='white'/></svg>",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: "marker-icon-bench",
  }),
  clock: new Icon({
    iconUrl:
      "data:image/svg+xml;utf8,<svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M20 2C12 2 6 8 6 16c0 8 14 22 14 22s14-14 14-22c0-8-6-14-14-14z' fill='%23396AB3' stroke='white' stroke-width='2'/><circle cx='20' cy='16' r='6' fill='white'/></svg>",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: "marker-icon-clock",
  }),
  cafe: new Icon({
    iconUrl:
      "data:image/svg+xml;utf8,<svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M20 2C12 2 6 8 6 16c0 8 14 22 14 22s14-14 14-22c0-8-6-14-14-14z' fill='%2300BFAE' stroke='white' stroke-width='2'/><circle cx='20' cy='16' r='6' fill='white'/></svg>",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: "marker-icon-cafe",
  }),
  park: new Icon({
    iconUrl:
      "data:image/svg+xml;utf8,<svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M20 2C12 2 6 8 6 16c0 8 14 22 14 22s14-14 14-22c0-8-6-14-14-14z' fill='%234CAF50' stroke='white' stroke-width='2'/><circle cx='20' cy='16' r='6' fill='white'/></svg>",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: "marker-icon-park",
  }),

  museum: new Icon({
    iconUrl:
      "data:image/svg+xml;utf8,<svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M20 2C12 2 6 8 6 16c0 8 14 22 14 22s14-14 14-22c0-8-6-14-14-14z' fill='red' stroke='white' stroke-width='2'/><circle cx='20' cy='16' r='6' fill='white'/></svg>",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: "marker-icon-park",
  }),
  artwork: new Icon({
    iconUrl:
      "data:image/svg+xml;utf8,<svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M20 2C12 2 6 8 6 16c0 8 14 22 14 22s14-14 14-22c0-8-6-14-14-14z' fill='pink' stroke='white' stroke-width='2'/><circle cx='20' cy='16' r='6' fill='white'/></svg>",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: "marker-icon-park",
  }),
  guest_house: new Icon({
    iconUrl:
      "data:image/svg+xml;utf8,<svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M20 2C12 2 6 8 6 16c0 8 14 22 14 22s14-14 14-22c0-8-6-14-14-14z' fill='yellow' stroke='white' stroke-width='2'/><circle cx='20' cy='16' r='6' fill='white'/></svg>",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: "marker-icon-park",
  }),
  gallery: new Icon({
    iconUrl:
      "data:image/svg+xml;utf8,<svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M20 2C12 2 6 8 6 16c0 8 14 22 14 22s14-14 14-22c0-8-6-14-14-14z' fill='cyan' stroke='white' stroke-width='2'/><circle cx='20' cy='16' r='6' fill='white'/></svg>",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: "marker-icon-park",
  }),
  // Add more categories as needed
};

// Helper to get color for each amenity type
const amenityColors: Record<string, string> = {
  restaurant: "%23FF7043",
  theatre: "%238E24AA",
  bench: "%238D6E63",
  clock: "%23396AB3",
  cafe: "%2300BFAE",
  park: "%234CAF50",
  default: "%23428AF4",
  museum: "red",
  artwork: "pink",
  guest_house: "yellow",
  gallery: "cyan",
};

// Helper to get amenity color, decoding for use in styles
const getAmenityColor = (amenity: string): string => {
  const color = amenityColors[amenity] || amenityColors.default;
  return color.replace(/%23/g, "#");
};

const AmenityIcon = ({ amenity, className }: { amenity: string, className?: string }) => {
  const iconPaths: Record<string, string> = {
    restaurant: "M6.5 10.5H4.5V12.5H6.5V10.5ZM17.5 10.5H9.5V12.5H17.5V10.5ZM21.5 2.5H2.5V4.5H21.5V2.5ZM21.5 6.5H2.5V8.5H21.5V6.5Z",
    cafe: "M16.5 4.5H3.5C2.4 4.5 1.5 5.4 1.5 6.5V12.5C1.5 13.6 2.4 14.5 3.5 14.5H16.5C17.6 14.5 18.5 13.6 18.5 12.5V6.5C18.5 5.4 17.6 4.5 16.5 4.5ZM16.5 12.5H3.5V6.5H16.5V12.5ZM20.5 8.5V10.5H22.5V8.5H20.5Z",
    theatre: "M20.5 2.5H3.5C2.4 2.5 1.5 3.4 1.5 4.5V20.5C1.5 21.6 2.4 22.5 3.5 22.5H20.5C21.6 22.5 22.5 21.6 22.5 20.5V4.5C22.5 3.4 21.6 2.5 20.5 2.5ZM20.5 20.5H3.5V4.5H20.5V20.5ZM8.5 16.5H15.5V18.5H8.5V16.5ZM8.5 12.5H15.5V14.5H8.5V12.5ZM8.5 8.5H15.5V10.5H8.5V8.5ZM8.5 4.5H15.5V6.5H8.5V4.5Z",
    park: "M16.5 12.5L12.5 8.5L8.5 12.5L4.5 8.5L0.5 12.5V20.5H24.5V12.5L20.5 8.5L16.5 12.5Z",
    default: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",
  };

  const path = iconPaths[amenity] || iconPaths.default;

  return (
    <svg className={className || "w-5 h-5 mr-2"} fill="currentColor" viewBox="0 0 24 24">
      <path d={path}></path>
    </svg>
  );
};

// Helper to generate favorite icon SVG with red border and amenity fill
function getFavoriteIcon(amenity: string) {
  const fill = amenityColors[amenity] || amenityColors.default;
  return new Icon({
    iconUrl: `data:image/svg+xml;utf8,<svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M20 2C12 2 6 8 6 16c0 8 14 22 14 22s14-14 14-22c0-8-6-14-14-14z' fill='${fill}' stroke='red' stroke-width='3'/><circle cx='20' cy='16' r='6' fill='white'/></svg>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: "marker-icon-favorite",
  });
}

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
  userSavedLocation?: { latitude: number; longitude: number } | null;
  showNearbyUsers?: boolean;
}

export interface MapRef {
  centerOnLocation: (lat: number, lng: number) => void;
}

// Inner map controls component that can access the map context
function MapControlsInner({
  onCenterLocation,
  mapRef,
}: {
  onCenterLocation: () => void;
  mapRef: React.MutableRefObject<any>;
}) {
  const map = useMap();
  
  // Store map reference for external access
  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);

  return (
    <div className="absolute top-4 right-4 z-[1000] space-y-3">
      {/* My Location Button */}
      <button
        onClick={onCenterLocation}
        className="btn-icon w-12 h-12 flex items-center justify-center"
        title="Center on my location"
      >
        <svg
          className="w-6 h-6 text-blue-600"
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

const Map = forwardRef<MapRef, MapProps>(({
  initialLocationId,
  locations,
  favorites,
  setFavorites,
  // onFavoriteToggle,
  onLocationChange,
  userSavedLocation,
  showNearbyUsers = false,
}, ref) => {
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
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [loadingNearbyUsers, setLoadingNearbyUsers] = useState(false);
  const mapRef = useRef<any>(null);
  const router = useRouter()

  useImperativeHandle(ref, () => ({
    centerOnLocation: (lat: number, lng: number) => {
      if (mapRef.current) {
        mapRef.current.setView([lat, lng], 15);
      }
    }
  }));

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newPosition: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setCurrentLocation(newPosition);
          setPosition(newPosition);
          setLoading(false);

          // Save location to database
          try {
            await updateCurrentLocation({
              latitude: newPosition[0],
              longitude: newPosition[1]
            });
            
            // Refresh nearby users if they are being shown
            if (showNearbyUsers) {
              loadNearbyUsers();
            }
          } catch (error) {
            console.error('Failed to save location to database:', error);
          }
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

  const handleLocationDragEnd = async (event: any) => {
    const newPosition: [number, number] = [
      event.target.getLatLng().lat,
      event.target.getLatLng().lng,
    ];

    setCurrentLocation(newPosition);
    setPosition(newPosition);
    setIsDraggingLocation(false);

    // Save location to database
    try {
      await updateCurrentLocation({
        latitude: newPosition[0],
        longitude: newPosition[1]
      });
      
      // Refresh nearby users if they are being shown
      if (showNearbyUsers) {
        loadNearbyUsers();
      }
    } catch (error) {
      console.error('Failed to save location to database:', error);
    }

    // Notify parent component about location change
    if (onLocationChange) {
      onLocationChange(newPosition[0], newPosition[1]);
    }
  };

  const loadNearbyUsers = async () => {
    if (!showNearbyUsers) return;
    
    setLoadingNearbyUsers(true);
    try {
      const users = await getNearbyUsers(5000); // 5km radius instead of 1km
      console.log('Nearby users received:', users);
      console.log('Number of nearby users:', users.length);
      setNearbyUsers(users);
    } catch (error) {
      console.error('Failed to load nearby users:', error);
    } finally {
      setLoadingNearbyUsers(false);
    }
  };

  useEffect(() => {
    if (showNearbyUsers) {
      loadNearbyUsers();
    }
  }, [showNearbyUsers]);

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
    } else if (userSavedLocation) {
      // Use user's saved location from database
      const savedPosition: [number, number] = [
        userSavedLocation.latitude,
        userSavedLocation.longitude,
      ];
      setCurrentLocation(savedPosition);
      setPosition(savedPosition);
    } else {
      // If no initial location or saved location, get user's current position
      getCurrentLocation();
    }
  }, [initialLocationId, locations, userSavedLocation]);

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

  const handleFavorite = async (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((item) => item !== id));
    } else {
      setFavorites([...favorites, id]);
    }
    const result = await toggleFavourites(id);
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

      {/* Loading nearby users indicator */}
      {showNearbyUsers && loadingNearbyUsers && (
        <div className="absolute top-4 right-4 z-[1002] bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="loading-spinner h-4 w-4 mr-2"></div>
            <span className="text-sm font-medium">
              Loading nearby users...
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
        ref={mapRef}
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
        {locations?.map(
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
                    ? getFavoriteIcon(
                        location.properties.amenity
                          ? location.properties.amenity
                          : location.properties.tourism
                      )
                    : amenityIcons[
                        location.properties.amenity
                          ? location.properties.amenity
                          : location.properties.tourism || ""
                      ] || defaultIcon
                }
              >
                <Popup>
                  <div className="w-64 rounded-lg shadow-lg overflow-hidden">
                    <div 
                      className={`p-3 text-white flex items-center`}
                      style={{ backgroundColor: getAmenityColor(location.properties.amenity || location.properties.tourism || 'default') }}
                    >
                      <AmenityIcon amenity={location.properties.amenity || location.properties.tourism || 'default'} className="w-5 h-5 mr-3" />
                      <h3 className="font-bold text-lg truncate">
                        {getLocationName(location)}
                      </h3>
                    </div>
                    <div className="p-4 bg-white">
                      <p className="text-sm text-gray-700 mb-2 capitalize">
                        {location.properties.amenity || location.properties.tourism || 'Location'}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        {getLocationDetails(location)}
                      </p>
                      {location.address?.street && (
                        <div className="text-xs text-gray-500 flex items-center mb-4">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                          <span>
                            {location.address.street}
                            {location.address.housenumber && ` ${location.address.housenumber}`}
                          </span>
                        </div>
                      )}
                       <div className="flex justify-between items-center">
                        <button
                          onClick={() => handleFavorite(location?._id as string)}
                          className={`py-2 px-4 rounded-full text-sm font-semibold flex items-center transition-colors ${
                            favorites.includes(location._id || "")
                              ? "bg-red-100 text-red-600 hover:bg-red-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          title={
                            favorites.includes(location._id || "")
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >
                          <svg
                            className={`w-4 h-4 mr-2 ${
                              favorites.includes(location._id || "") ? "text-red-500" : ""
                            }`}
                            fill={
                              favorites.includes(location._id || "")
                                ? "currentColor"
                                : "none"
                            }
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                          {favorites.includes(location._id || "")
                            ? "Favorited"
                            : "Favorite"}
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard?locationId=${location?._id}`)}
                          className="text-blue-500 hover:text-blue-600 text-sm font-semibold">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
        )}

        {/* Nearby Users Markers */}
        {showNearbyUsers && nearbyUsers.map((user) => (
          <Marker
            key={user._id}
            position={[user.currentLocation.latitude, user.currentLocation.longitude]}
            icon={userIcon}
          >
            <Popup>
              <div className="p-3 min-w-[200px]">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <h3 className="font-semibold text-gray-900">
                    {user.fullName}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Nearby User
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Last updated: {new Date(user.currentLocation.updatedAt).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        <MapUpdater center={position} />
        <MapControlsInner onCenterLocation={getCurrentLocation} mapRef={mapRef} />
      </MapContainer>
      {/* Floating Action Buttons (FABs) */}
      <div className="fixed bottom-8 right-8 z-[1100] flex flex-col items-end space-y-4">
        <button
          onClick={getCurrentLocation}
          className="btn-icon w-14 h-14 flex items-center justify-center shadow-lg"
          title="Center on my location"
        >
          <svg
            className="w-6 h-6 text-blue-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </button>
        {/* Add more FABs here, e.g., for filters, legend, etc. */}
      </div>
    </div>
  );
});

Map.displayName = 'Map';

export default Map;
