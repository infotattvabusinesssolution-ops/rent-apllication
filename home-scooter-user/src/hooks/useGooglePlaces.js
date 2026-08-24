import { useState, useEffect, useRef } from 'react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBGtqdVoKgd9sCmz2Y8wxuwa0WfDBaymGk';

export const useGooglePlaces = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const autocompleteServiceRef = useRef(null);
  const geocoderRef = useRef(null);

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      geocoderRef.current = new window.google.maps.Geocoder();
      setIsLoaded(true);
      return;
    }

    // Check if script is already present in document
    const existingScript = document.getElementById('google-maps-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google && window.google.maps && window.google.maps.places) {
          autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
          geocoderRef.current = new window.google.maps.Geocoder();
          setIsLoaded(true);
        }
      };
      document.head.appendChild(script);
    } else {
      existingScript.addEventListener('load', () => {
        if (window.google && window.google.maps && window.google.maps.places) {
          autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
          geocoderRef.current = new window.google.maps.Geocoder();
          setIsLoaded(true);
        }
      });
    }
  }, []);

  // Search Places Autocomplete Predictions
  const getPredictions = (input) => {
    return new Promise((resolve) => {
      if (!input || input.trim().length < 2) {
        resolve([]);
        return;
      }

      if (autocompleteServiceRef.current) {
        autocompleteServiceRef.current.getPlacePredictions(
          {
            input,
            componentRestrictions: { country: 'in' },
            types: ['(regions)'],
          },
          (predictions, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
              resolve(predictions.map((p) => p.description));
            } else {
              // Fallback to Places REST / Geocoding if predictions fail
              fetchGeocodePredictions(input).then(resolve);
            }
          }
        );
      } else {
        fetchGeocodePredictions(input).then(resolve);
      }
    });
  };

  // Reverse Geocode (Lat, Lng) to Address string
  const getCurrentAddress = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          if (geocoderRef.current) {
            geocoderRef.current.geocode(
              { location: { lat: latitude, lng: longitude } },
              (results, status) => {
                if (status === 'OK' && results && results[0]) {
                  const placeName = formatAddressFromResult(results[0]);
                  resolve({ address: placeName, coords: { latitude, longitude } });
                } else {
                  fetchReverseGeocodeRest(latitude, longitude)
                    .then((placeName) => resolve({ address: placeName, coords: { latitude, longitude } }))
                    .catch(reject);
                }
              }
            );
          } else {
            fetchReverseGeocodeRest(latitude, longitude)
              .then((placeName) => resolve({ address: placeName, coords: { latitude, longitude } }))
              .catch(reject);
          }
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  return { isLoaded, getPredictions, getCurrentAddress };
};

// Fallback REST fetch for Geocoding if JS SDK is loading
async function fetchGeocodePredictions(query) {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      query
    )}&components=country:IN&key=${GOOGLE_MAPS_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results.slice(0, 5).map((r) => r.formatted_address);
    }
  } catch (e) {}
  return [];
}

async function fetchReverseGeocodeRest(lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.results && data.results.length > 0) {
    return formatAddressFromResult(data.results[0]);
  }
  return `Bangalore, Karnataka`;
}

function formatAddressFromResult(result) {
  let sublocality = '';
  let locality = '';
  let state = '';

  for (const component of result.address_components) {
    const types = component.types;
    if (types.includes('sublocality') || types.includes('neighborhood') || types.includes('sublocality_level_1')) {
      sublocality = component.long_name;
    }
    if (types.includes('locality')) {
      locality = component.long_name;
    }
    if (types.includes('administrative_area_level_1')) {
      state = component.long_name;
    }
  }

  if (sublocality && locality) {
    return `${sublocality}, ${locality}`;
  }
  if (locality && state) {
    return `${locality}, ${state}`;
  }
  return result.formatted_address || 'Bangalore, Karnataka';
}
