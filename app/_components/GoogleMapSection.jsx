"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Home } from "lucide-react";
import { createRoot } from "react-dom/client";

const GoogleMapSection = ({ listing, coordinates, boundingBox }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [satelliteView, setSatelliteView] = useState(false);

  const center = coordinates
    ? [coordinates.lon, coordinates.lat]
    : [-98.5795, 39.8283];

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: satelliteView
        ? "https://api.maptiler.com/maps/hybrid/style.json?key=X8chXEtN8gGlWO2Km6HQ"
        : "https://api.maptiler.com/maps/streets-v2/style.json?key=X8chXEtN8gGlWO2Km6HQ",
      center,
      zoom: coordinates ? 10 : 3,
    });

    listing?.forEach((item) => {
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.width = "30px";
      el.style.height = "30px";
      el.style.cursor = "pointer";

      const root = createRoot(el);
      root.render(<Home size={30} color="#ff0000" />);

      const popup = new maplibregl.Popup({
        offset: 0,
        closeButton: false,
        maxWidth: "none",
      }).setDOMContent(createPopupDOM(item));

      function createPopupDOM(item) {
        const container = document.createElement("div");
        container.className =
          "rounded-lg overflow-hidden text-gray-700 text-sm m-0 p-0";
        container.style.width = "230px";
        container.style.margin = "0";
        container.style.padding = "0";
        container.innerHTML = `
        <div class="relative">
          <img src="${item.primary_photo}" alt="${
          item.address
        }" class="w-full h-[120px] object-cover rounded-t-lg" />
          <button class="absolute top-2 right-2 bg-white/80 hover:bg-white text-black rounded-full p-1 shadow-sm z-10" onclick="this.closest('.maplibregl-popup').remove()">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="space-y-2 pt-2">
          <h2 class="text-lg font-semibold text-black ml-1">$${item.price}</h2>
          <div class="flex items-start text-gray-500 text-xs mt-[-4] mb-4 ml-1">
            <p>${item.address}</p>
          </div>

          <div class="flex justify-between gap-1 text-gray-600 text-xs mt-[-4]">
            <div class="flex gap-1 items-center bg-slate-100 p-1 px-2 rounded-md w-full justify-center">
              🛏️ ${item.bedroom}
            </div>
            <div class="flex gap-1 items-center bg-slate-100 p-1 px-2 rounded-md w-full justify-center">
              🛁 ${item.bathroom}
            </div>
            <div class="flex gap-1 items-center bg-slate-100 p-1 px-2 rounded-md w-full justify-center">
              📏 ${item.area}
            </div>
          </div>

          <div class="mt-3">
            <div class="px-1 py-2 bg-primary">
            <a 
              href="${`${window.location.origin}/edit-listing/${item.id}`}"
              class="flex items-center justify-center w-full text-white font-semibold rounded text-sm"
              target="_blank"
            >
              View Details
            </a>
          </div>
          </div>
        </div>
      `;
        return container;
      }

      new maplibregl.Marker(el)
        .setLngLat([item.coordinates.lon, item.coordinates.lat])
        .setPopup(popup)
        .addTo(mapRef.current);
    });

    if (boundingBox && boundingBox.length === 4) {
      const bounds = [
        [parseFloat(boundingBox[2]), parseFloat(boundingBox[0])],
        [parseFloat(boundingBox[3]), parseFloat(boundingBox[1])],
      ];

      new maplibregl.LngLatBounds(bounds).extend(bounds[0]).extend(bounds[1]);

      mapRef.current.fitBounds(bounds, { padding: 20 });
    }
  }, [coordinates, satelliteView, listing, boundingBox]);

  return (
    <div className="w-full">
      <div className="flex items-center space-x-2 mb-5">
        <Switch
          id="view-toggle"
          checked={satelliteView}
          onCheckedChange={setSatelliteView}
        />
        <Label htmlFor="view-toggle" className="text-md text-muted-foreground">
          {satelliteView ? "Satellite View" : "Street View"}
        </Label>
      </div>
      <div
        ref={mapContainerRef}
        className="w-full h-[500px] rounded-xl overflow-hidden"
      />
    </div>
  );
};

export default GoogleMapSection;
