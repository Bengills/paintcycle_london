import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';

// Component to auto-fit map to markers
const FitBoundsToMarkers = ({ markers }) => {
  const map = useMap();
  
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(marker => {
        const coords = postcodeCoordinates[marker.location] || [51.5074, -0.1278]; // Default to London center
        return L.latLng(coords[0], coords[1]);
      }));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, markers]);
  
  return null;
};

// London postcodes with approximate coordinates
const postcodeCoordinates = {
  'N1': [51.5362, -0.0969],
  'E2': [51.5295, -0.0550],
  'SW11': [51.4700, -0.1683],
  'W1': [51.5150, -0.1414],
  'SE1': [51.5000, -0.0900],
  'NW3': [51.5559, -0.1780],
  'W11': [51.5100, -0.2100],
  'EC1': [51.5200, -0.0900]
};

const MapView = ({ paintListings, onBackToGrid }) => {
  // Center map on London by default
  const londonCenter = [51.5074, -0.1278];
  const defaultZoom = 12;

  // Fix for Leaflet marker icons
  useEffect(() => {
    // Fix Leaflet icon issues
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  // Custom marker icon for paint listings
  const paintIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="h-[70vh] w-full relative">
      <MapContainer 
        center={londonCenter} 
        zoom={defaultZoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        
        {paintListings.map((paint) => {
          const coords = postcodeCoordinates[paint.location] || londonCenter;
          return (
            <Marker 
              key={paint.id} 
              position={coords}
              icon={paintIcon}
            >
              <Popup>
                <div className="p-1">
                  <div 
                    className="h-16 w-full mb-2 rounded" 
                    style={{ backgroundColor: paint.colorHex }}
                  ></div>
                  <h3 className="font-medium text-gray-900">{paint.brand}</h3>
                  <p className="text-sm text-gray-600">{paint.color}</p>
                  <p className="text-xs text-gray-500 mt-1">{paint.location} · {paint.distance} miles away</p>
                  <Link 
                    to={`/paint/${paint.id}`}
                    className="mt-2 block text-center text-xs px-2 py-1 border border-emerald-600 rounded text-emerald-600 hover:bg-emerald-50"
                  >
                    View Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
        
        <FitBoundsToMarkers markers={paintListings} />
      </MapContainer>
      
      <button
        onClick={onBackToGrid}
        className="absolute top-4 left-4 z-[1000] bg-white px-3 py-2 rounded-md shadow-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
      >
        Back to Grid View
      </button>
    </div>
  );
};

export default MapView;