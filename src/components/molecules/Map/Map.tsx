import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

type LatLng = {
  lat: number;
  lng: number;
};

const MapComponent = ({
  setLatLng,
  defaultLocation,
}: {
  setLatLng?: (latLng: LatLng) => void;
  defaultLocation?: LatLng;
}) => {
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [marker, setMarker] = useState<LatLng | null>(null);

  const mapContainerStyle: React.CSSProperties = {
    width: "100%",
    height: "400px",
  };

  const KSALatLng: LatLng = {
    lat: 24.7136,
    lng: 46.6753,
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    setMarker({ lat, lng });
    if (setLatLng) setLatLng({ lat, lng });
  };

  useEffect(() => {
    if (!defaultLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ lat: latitude, lng: longitude });
            if (setLatLng) setLatLng({ lat: latitude, lng: longitude });
          },
          (err) => {
            console.error("Error getting location:", err);
          }
        );
      } else {
        console.error(
          "Geolocation is not supported by this browser, or access is denied."
        );
      }
    } else {
      setCurrentLocation(defaultLocation);
    }
  }, [defaultLocation, setLatLng]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey!,
  });

  if (loadError) {
    console.error("Error loading Google Maps API:", loadError);
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={currentLocation || KSALatLng}
      zoom={12}
      onClick={handleMapClick}
    >
      <Marker position={marker || currentLocation || KSALatLng} />
    </GoogleMap>
  );
};

export default MapComponent;
