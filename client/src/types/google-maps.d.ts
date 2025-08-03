declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element | null, opts?: MapOptions);
      addListener(eventName: string, handler: Function): void;
      setCenter(latlng: LatLng | LatLngLiteral): void;
    }

    interface MapOptions {
      zoom?: number;
      center?: LatLng | LatLngLiteral;
      mapTypeId?: MapTypeId;
      streetViewControl?: boolean;
      mapTypeControl?: boolean;
      fullscreenControl?: boolean;
    }

    interface LatLng {
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
    }

    class Geocoder {
      geocode(request: GeocoderRequest): Promise<GeocoderResponse>;
    }

    interface GeocoderRequest {
      location?: LatLng | LatLngLiteral;
    }

    interface GeocoderResponse {
      results: GeocoderResult[];
    }

    interface GeocoderResult {
      formatted_address: string;
    }

    interface MapMouseEvent {
      latLng?: LatLng;
    }

    enum MapTypeId {
      ROADMAP = "roadmap"
    }

    namespace places {
      class PlacesService {
        constructor(map: Map);
        findPlaceFromQuery(request: FindPlaceFromQueryRequest, callback: (results: PlaceResult[] | null, status: PlacesServiceStatus) => void): void;
      }

      interface FindPlaceFromQueryRequest {
        query: string;
        fields: string[];
      }

      interface PlaceResult {
        place_id?: string;
        geometry?: PlaceGeometry;
        formatted_address?: string;
      }

      interface PlaceGeometry {
        location?: LatLng;
      }

      enum PlacesServiceStatus {
        OK = "OK"
      }
    }
  }
}

export {};