'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-gray-100 flex items-center justify-center">Loading map...</div>
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