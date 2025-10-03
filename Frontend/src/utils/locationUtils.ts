// Location utility functions using Haversine formula for distance calculations

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationProvider {
  id: number;
  name: string;
  latitude?: number;
  longitude?: number;
  location?: string;
  operating_hours?: string;
  [key: string]: any;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate distance between two points using Haversine formula
 * @param lat1 Latitude of first point
 * @param lng1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lng2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

/**
 * Get user's current location using browser geolocation API
 */
export function getCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
}

/**
 * Geocode an address using Nominatim API
 */
export async function geocodeAddress(address: string): Promise<Coordinates | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}&countrycodes=ke&limit=1`
    );

    if (response.ok) {
      const data = await response.json();
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
  }
  
  return null;
}

/**
 * Find providers within a specified radius of user location
 */
export async function findNearbyProviders<T extends LocationProvider>(
  providers: T[],
  userLocation: Coordinates,
  maxDistanceKm: number = 50
): Promise<Array<T & { distance: number }>> {
  const nearbyProviders: Array<T & { distance: number }> = [];

  for (const provider of providers) {
    let providerCoords: Coordinates | null = null;

    // Use provider's coordinates if available
    if (provider.latitude && provider.longitude) {
      providerCoords = {
        lat: provider.latitude,
        lng: provider.longitude,
      };
    } else if (provider.location) {
      // Geocode the location string
      providerCoords = await geocodeAddress(provider.location);
    }

    if (providerCoords) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        providerCoords.lat,
        providerCoords.lng
      );

      if (distance <= maxDistanceKm) {
        nearbyProviders.push({
          ...provider,
          distance: Math.round(distance * 10) / 10, // Round to 1 decimal place
        });
      }
    }
  }

  // Sort by distance (closest first)
  return nearbyProviders.sort((a, b) => a.distance - b.distance);
}

/**
 * Format distance for display
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m away`;
  }
  return `${distance}km away`;
}
