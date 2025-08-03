import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation } from "lucide-react";

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface GoogleMapsProps {
  onLocationSelect: (location: Location) => void;
  initialLocation?: Location;
  className?: string;
}

export function GoogleMaps({ onLocationSelect, initialLocation, className }: GoogleMapsProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLocation, setCurrentLocation] = useState<Location | null>(initialLocation || null);

  // Load Google Maps API
  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&language=ar&region=SA`;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || map) return;

    const defaultCenter = initialLocation 
      ? { lat: initialLocation.lat, lng: initialLocation.lng }
      : { lat: 24.7136, lng: 46.6753 }; // Riyadh center

    const mapInstance = new (window as any).google.maps.Map(
      document.getElementById("google-map") as HTMLElement,
      {
        zoom: 13,
        center: defaultCenter,
        mapTypeId: (window as any).google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }
    );

    setMap(mapInstance);

    // Add click listener
    mapInstance.addListener("click", (event: any) => {
      if (event.latLng) {
        const location = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
          address: "الموقع المحدد",
        };
        updateLocation(location);
      }
    });
  }, [isLoaded]);

  // Update location and marker
  const updateLocation = useCallback(async (location: Location) => {
    if (!map) return;

    // Remove existing marker
    if (marker) {
      marker.setMap(null);
    }

    // Add new marker
    const newMarker = new (window as any).google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: map,
      title: location.address,
    });

    setMarker(newMarker);
    setCurrentLocation(location);
    map.setCenter({ lat: location.lat, lng: location.lng });

    // Reverse geocode to get address
    try {
      const geocoder = new (window as any).google.maps.Geocoder();
      const result = await geocoder.geocode({
        location: { lat: location.lat, lng: location.lng },
      });

      if (result.results && result.results[0]) {
        const address = result.results[0].formatted_address;
        const updatedLocation = { ...location, address };
        setCurrentLocation(updatedLocation);
        onLocationSelect(updatedLocation);
      } else {
        onLocationSelect(location);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      onLocationSelect(location);
    }
  }, [map, marker, onLocationSelect]);

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: "موقعي الحالي",
          };
          updateLocation(location);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  };

  // Search for location
  const searchLocation = () => {
    if (!map || !searchQuery.trim()) return;

    const service = new (window as any).google.maps.places.PlacesService(map);
    const request = {
      query: searchQuery,
      fields: ["place_id", "geometry", "formatted_address"],
    };

    service.findPlaceFromQuery(request, (results: any, status: any) => {
      if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
        const place = results[0];
        if (place.geometry && place.geometry.location) {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address || searchQuery,
          };
          updateLocation(location);
        }
      }
    });
  };

  if (!isLoaded) {
    return (
      <div className={`h-64 bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <MapPin className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">جاري تحميل الخريطة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search input */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="ابحث عن موقع..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={getCurrentLocation}
          title="موقعي الحالي"
        >
          <Navigation className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          onClick={searchLocation}
          disabled={!searchQuery.trim()}
        >
          بحث
        </Button>
      </div>

      {/* Map container */}
      <div id="google-map" className="h-64 rounded-lg border" />

      {/* Selected location display */}
      {currentLocation && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            <MapPin className="w-4 h-4 inline ml-1" />
            {currentLocation.address}
          </p>
        </div>
      )}
    </div>
  );
}
