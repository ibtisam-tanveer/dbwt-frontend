'use client';

import dynamic from 'next/dynamic';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { MapRef } from './Map';

const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 flex items-center justify-center rounded-lg">
      <div className="text-center">
        <div className="loading-spinner h-8 w-8 mx-auto mb-3"></div>
        <p className="text-gray-600 text-sm font-medium">Loading map...</p>
      </div>
    </div>
  )
});

interface MapWrapperProps {
  initialLocationId?: string;
  locations: any[];
  favorites: string[];
  setFavorites:any;
  // onFavoriteToggle: (locationId: string) => void;
  onLocationChange?: (lat: number, lng: number) => void;
  userSavedLocation?: { latitude: number; longitude: number } | null;
  showNearbyUsers?: boolean;
}

export interface MapWrapperRef {
  centerOnLocation: (lat: number, lng: number) => void;
}

const MapWrapper = forwardRef<MapWrapperRef, MapWrapperProps>(({ 
  initialLocationId, 
  locations, 
  favorites, 
  setFavorites,
  // onFavoriteToggle,
  onLocationChange,
  userSavedLocation,
  showNearbyUsers = false,
}, ref) => {
  const mapRef = useRef<MapRef>(null);

  useImperativeHandle(ref, () => ({
    centerOnLocation: (lat: number, lng: number) => {
      if (mapRef.current) {
        mapRef.current.centerOnLocation(lat, lng);
      }
    }
  }));

  return (
    <Map 
      ref={mapRef}
      initialLocationId={initialLocationId}
      locations={locations}
      favorites={favorites}
      setFavorites={setFavorites}
      // onFavoriteToggle={onFavoriteToggle}
      onLocationChange={onLocationChange}
      userSavedLocation={userSavedLocation}
      showNearbyUsers={showNearbyUsers}
    />
  );
});

MapWrapper.displayName = 'MapWrapper';

export default MapWrapper; 