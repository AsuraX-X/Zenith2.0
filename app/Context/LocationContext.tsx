import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type address = {
  suburb: string;
  street: string;
};

interface LCI {
  location: string;
  setLocation: (location: string) => void;
  findLocation: () => void;
  autoComplete: (location: string) => void;
  addresses: address[];
  cordinates: {
    lat: number;
    long: number;
  };
}

const LocationContext = createContext<null | LCI>(null);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState("");
  const [addresses, setAddresses] = useState<address[]>([]);
  const key = import.meta.env.VITE_LOCATIONIQ_KEY;
  const [cordinates, setCordinates] = useState({ lat: 5.56, long: -0.205 });

  function findLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

    function successCallback(position: GeolocationPosition) {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      console.log(`lat: ${lat}, long: ${long}`);
      setCordinates({ lat, long });
      reverseGeocode(cordinates.lat, cordinates.long);
    }
  }

  const reverseGeocode = async (lat: number, long: number) => {
    try {
      const res = await fetch(
        `https://us1.locationiq.com/v1/reverse?key=${key}&lat=${lat}&lon=${long}&format=json&`
      );
      const data = await res.json();

      setLocation(`${data.address.suburb}, ${data.address.road}`);

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const autoComplete = async (location: string) => {
    try {
      const res = await fetch(
        `https://api.locationiq.com/v1/autocomplete?key=${key}&q=${location}&limit=5&dedupe=1&`
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
    const stored = localStorage.getItem("location");
    if (stored) setLocation(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("location", location);
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
