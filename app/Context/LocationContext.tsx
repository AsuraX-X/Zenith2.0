import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { location } from "../Interfaces/Interfaces";

type address = {
  suburb: string;
  street: string;
};

interface LCI {
  location: location;
  setLocation: (location: location) => void;
  findLocation: () => void;
  geocode: (location: string) => void;
  autoComplete: (location: string) => void;
  addresses: address[];
  cordinates: {
    lat: number;
    lon: number;
  };
}

const LocationContext = createContext<null | LCI>(null);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<location>({
    name: "",
    lat: 0,
    lon: 0,
  });
  const [addresses, setAddresses] = useState<address[]>([]);
  const key = import.meta.env.VITE_LOCATIONIQ_KEY;
  const [cordinates, setCordinates] = useState({ lat: 5.56, lon: -0.205 });

  function findLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

    function successCallback(position: GeolocationPosition) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      setLocation((prev) => ({
        ...prev,
        lat,
        lon,
      }));
      console.log(`lat: ${lat}, lon: ${lon}`);
      setCordinates({ lat, lon });
      reverseGeocode(cordinates.lat, cordinates.lon);
    }
  }

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://us1.locationiq.com/v1/reverse?key=${key}&lat=${lat}&lon=${lon}&format=json&`
      );
      const data = await res.json();

      setLocation((prev) => ({
        ...prev,
        name: `${data.address.suburb}, ${data.address.road}`,
      }));

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const geocode = async (location: string) => {
    const encodedValue = encodeURIComponent(location);

    const res = await fetch(
      `https://us1.locationiq.com/v1/search?key=${key}&q=${encodedValue}&format=json`
    );
    const data = await res.json();
    console.log(data);
    setLocation((prev) => ({
      ...prev,
      lat: data[0].lat,
      lon: data[0].lon,
    }));
  };

  useEffect(() => {
    console.log(location);
  }, [location]);

  const autoComplete = async (location: string) => {
    try {
      const res = await fetch(
        `https://api.locationiq.com/v1/autocomplete?key=${key}&q=${location}&limit=5&dedupe=1&countrycodes=gh&`
      );

      const data = await res.json();

      setAddresses(
        data.map((item: { address: { suburb: string; name: string } }) => ({
          suburb: item.address.suburb,
          street: item.address.name,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(location);
  }, [location]);

  useEffect(() => {
    const stored = localStorage.getItem("location");
    if (stored) setLocation(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("location", JSON.stringify(location));
  }, [location]);

  function errorCallback(error: GeolocationPositionError) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.error("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.error("The request to get user location timed out.");
        break;
      default:
        console.error("An unknown error occurred.");
        break;
    }
  }

  return (
    <LocationContext
      value={{
        cordinates,
        location,
        setLocation,
        findLocation,
        geocode,
        autoComplete,
        addresses,
      }}
    >
      {children}
    </LocationContext>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error("Location context not provided");
  return context;
};
