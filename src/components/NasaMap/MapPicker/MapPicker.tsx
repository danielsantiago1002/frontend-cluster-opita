import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import type { LatLngLiteral } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- Fix for missing default marker icons ---
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;
// --------------------------------------------

type MapPickerProps = {
  onSelect: (coord: LatLngLiteral) => void;
  height?: string;
  initialZoom?: number;
};

const BOGOTA: LatLngLiteral = { lat: 4.711, lng: -74.0721 };

function ClickHandler({ onClick }: { onClick: (coord: LatLngLiteral) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

export const MapPicker: React.FC<MapPickerProps> = ({
  onSelect,
  height = '360px',
  initialZoom = 12,
}) => {
  const [center, setCenter] = useState<LatLngLiteral | null>(null);
  const [selected, setSelected] = useState<LatLngLiteral | null>(null);
  const asked = useRef(false);

  const handleClick = useCallback(
    (coord: LatLngLiteral) => {
      setSelected(coord);
      onSelect(coord);
    },
    [onSelect]
  );

  useEffect(() => {
    if (asked.current) return;
    asked.current = true;

    if (!('geolocation' in navigator)) {
      setCenter(BOGOTA);
      setSelected(BOGOTA);
      onSelect(BOGOTA);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(c);
        setSelected(c);
        onSelect(c);
      },
      () => {
        setCenter(BOGOTA);
        setSelected(BOGOTA);
        onSelect(BOGOTA);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [onSelect]);

  if (!center) {
    return (
      <div
        style={{
          height,
          width: '100%',
          display: 'grid',
          placeItems: 'center',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          color: '#6b7280',
        }}
      >
        Loading map…
      </div>
    );
  }

  return (
    <div className='border-1' style={{ height, width: '100%' }}>
      <MapContainer
        center={center}
        zoom={initialZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <ClickHandler onClick={handleClick} />
        {selected && <Marker position={selected} />}
      </MapContainer>
    </div>
  );
};
