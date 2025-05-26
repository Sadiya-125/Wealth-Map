"use client";
import { MapPin } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const GoogleAddressSearch = ({ onSelectAddress }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (value) => {
    setQuery(value);

    if (value.length < 3) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(
        `https://us1.locationiq.com/v1/search?key=${
          process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY
        }&q=${encodeURIComponent(value)}&format=json`
      );
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("LocationIQ Error:", error);
      setResults([]);
    }
  };

  const handleSelect = (item) => {
    setQuery(item.display_name);
    setResults([]);
    console.log(item);
    onSelectAddress({
      address: item.display_name,
      lat: item.lat,
      lon: item.lon,
      boundingBox: item.boundingbox,
    });
  };

  return (
    <div className="w-full mx-auto mt-10 relative" ref={wrapperRef}>
      <div className="flex w-full border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 bg-white">
        <div className="bg-purple-200 px-3 flex items-center justify-center rounded-l-lg">
          <MapPin className="h-5 w-5 text-primary" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search Property Address"
          className="w-full px-4 py-2 text-md focus:outline-none rounded-r-lg"
        />
      </div>

      {results.length > 0 && (
        <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-fade-in">
          {results.map((item, index) => (
            <li
              key={index}
              className="px-4 py-2 text-md hover:bg-purple-100 cursor-pointer transition-colors"
              onClick={() => handleSelect(item)}
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GoogleAddressSearch;
