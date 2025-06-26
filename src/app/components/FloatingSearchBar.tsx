import React, { useState } from "react";

interface FloatingSearchBarProps {
  onSearch: (query: string) => void;
  onFilterClick: () => void;
  onLocationClick?: () => void;
}

export default function FloatingSearchBar({
  onSearch,
  onFilterClick,
  onLocationClick,
}: FloatingSearchBarProps) {
  const [query, setQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="fixed top-20 left-6 z-[1050] flex items-center w-[350px] max-w-full bg-white rounded-full shadow-lg border border-gray-200 px-4 py-2 space-x-2">
      {/* Search Icon */}
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      {/* Search Input */}
      <input
        type="text"
        className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400 px-2"
        placeholder="Search for places or categories..."
        value={query}
        onChange={handleInputChange}
      />
      {/* Filter Button */}
      <button
        onClick={onFilterClick}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        title="Filters"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 019 18v-4.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z" />
        </svg>
      </button>
      {/* My Location Button (optional) */}
      {onLocationClick && (
        <button
          onClick={onLocationClick}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="My Location"
        >
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </button>
      )}
    </div>
  );
} 