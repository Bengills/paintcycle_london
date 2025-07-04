import { useState, useEffect } from 'react';
import { useProfile } from './useProfile';

// Cache for postcode coordinates to avoid repeated API calls
const coordinatesCache = new Map<string, { lat: number; lon: number }>();

export const usePostcodeDistance = () => {
  const { profile } = useProfile();
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    const fetchUserCoordinates = async () => {
      if (!profile?.postcode) return;

      try {
        // Check cache first
        if (coordinatesCache.has(profile.postcode)) {
          setUserCoordinates(coordinatesCache.get(profile.postcode)!);
          return;
        }

        // Fetch coordinates from postcodes.io API
        const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(profile.postcode)}`);
        const data = await response.json();

        if (data.status === 200) {
          const coords = {
            lat: data.result.latitude,
            lon: data.result.longitude
          };
          coordinatesCache.set(profile.postcode, coords);
          setUserCoordinates(coords);
        }
      } catch (error) {
        console.error('Error fetching user coordinates:', error);
      }
    };

    fetchUserCoordinates();
  }, [profile?.postcode]);

  const calculateDistance = async (targetPostcode: string): Promise<number | null> => {
    if (!userCoordinates || !targetPostcode) return null;

    try {
      // Check cache first
      if (!coordinatesCache.has(targetPostcode)) {
        const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(targetPostcode)}`);
        const data = await response.json();

        if (data.status === 200) {
          coordinatesCache.set(targetPostcode, {
            lat: data.result.latitude,
            lon: data.result.longitude
          });
        }
      }

      const targetCoords = coordinatesCache.get(targetPostcode);
      if (!targetCoords) return null;

      // Calculate distance using Haversine formula
      const R = 3959; // Earth's radius in miles
      const lat1 = userCoordinates.lat * Math.PI / 180;
      const lat2 = targetCoords.lat * Math.PI / 180;
      const dLat = (targetCoords.lat - userCoordinates.lat) * Math.PI / 180;
      const dLon = (targetCoords.lon - userCoordinates.lon) * Math.PI / 180;

      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;

      return Number(distance.toFixed(1));
    } catch (error) {
      console.error('Error calculating distance:', error);
      return null;
    }
  };

  return { calculateDistance, userCoordinates };
};