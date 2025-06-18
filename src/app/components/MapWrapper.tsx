'use client';

import dynamic from 'next/dynamic';

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
  onFavoriteToggle: (locationId: string) => void;
}

export default function MapWrapper({ 
  initialLocationId, 
  locations, 
  favorites, 
  onFavoriteToggle 
}: MapWrapperProps) {
  return (
    <Map 
      initialLocationId={initialLocationId}
      locations={locations}
      favorites={favorites}
      onFavoriteToggle={onFavoriteToggle}
    />
  );
} 