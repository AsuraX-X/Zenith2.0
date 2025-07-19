import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Polyline,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import { useState, useEffect, useMemo, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useParams } from "react-router";
import type { location } from "../Interfaces/Interfaces";
import { useLocationStore } from "../stores/locationStore";

const CustomerRoute = () => {
  const { findLocation } = useLocationStore();
  const coordinates = useLocationStore((state) => state.coordinates);
  const hasRequestedRoute = useRef(false);

  const { location } = useParams();

  const loc: location = location && JSON.parse(location);

  useEffect(() => {
    console.log(loc);
  }, [loc]);

  const [userPosition, setUserPosition] = useState<LatLngExpression>([
    coordinates.lat,
    coordinates.lon,
  ]);

  const [route, setRoute] = useState<LatLngExpression[] | null>(null);

  const destination = useMemo(() => [loc.lon, loc.lat], [loc.lon, loc.lat]);

  useEffect(() => {
    findLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  useEffect(() => {
    setUserPosition([coordinates.lat, coordinates.lon]);
  }, [coordinates.lat, coordinates.lon]); // Update position when coordinates change

  useEffect(() => {
    const getRoute = async () => {
      // Prevent multiple requests
      if (hasRequestedRoute.current) return;

      try {
        console.log("Sending coordinates:", {
          startLat: coordinates.lat,
          startLng: coordinates.lon,
          endLat: destination[1],
          endLng: destination[0],
        });

        // Use fetch directly with LocationIQ API
        const key = import.meta.env.VITE_LOCATIONIQ_KEY;
        const response = await fetch(
          `https://us1.locationiq.com/v1/directions/driving/${coordinates.lon},${coordinates.lat};${destination[0]},${destination[1]}?key=${key}&overview=full&geometries=geojson`
        );

        const data = await response.json();
        console.log(data);

        // LocationIQ returns coordinates in routes format
        const coords = data.routes[0].geometry.coordinates.map(
          (c: [number, number]) => [
            c[1], // latitude
            c[0], // lonitude
          ]
        );
        setRoute(coords);
        console.log(coords);

        hasRequestedRoute.current = true;
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    // Only get route when coordinates have been updated from default values (indicating location was found)
    const hasValidCoordinates =
      coordinates.lat !== 5.56 || coordinates.lon !== -0.205;
    if (
      hasValidCoordinates &&
      coordinates.lat &&
      coordinates.lon &&
      !hasRequestedRoute.current
    ) {
      getRoute();
    }
  }, [coordinates.lat, coordinates.lon, destination]);

  // Create a custom red icon for user location
  const userIcon = L.icon({
    iconUrl:
      "data:image/svg+xml;base64," +
      btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="#ff1200"/>
        <circle cx="12.5" cy="12.5" r="5" fill="white"/>
      </svg>
    `),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: markerShadow,
    shadowSize: [41, 41],
  });

  // Create a custom green icon for destination
  const destinationIcon = L.icon({
    iconUrl:
      "data:image/svg+xml;base64," +
      btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="#00aa00"/>
        <circle cx="12.5" cy="12.5" r="5" fill="white"/>
      </svg>
    `),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: markerShadow,
    shadowSize: [41, 41],
  });

  return (
    <div>
      <MapContainer
        center={userPosition}
        zoom={15}
        style={{ height: "100vh", width: "100%" }}
        zoomControl={true}
      >
        {/* User location marker */}
        <Marker position={userPosition} icon={userIcon}>
          <Popup>
            <div>
              <strong>You are here</strong>
              <br />
              Lat:{" "}
              {Array.isArray(userPosition) ? userPosition[0].toFixed(6) : "N/A"}
              <br />
              Lng:{" "}
              {Array.isArray(userPosition) ? userPosition[1].toFixed(6) : "N/A"}
            </div>
          </Popup>
        </Marker>

        {/* Destination marker */}
        <Marker position={[loc.lat, loc.lon]} icon={destinationIcon}>
          <Popup>
            <div>
              <strong>Destination</strong>
              <br />
              {loc.name}
              <br />
              Lat: {loc.lat.toFixed(6)}
              <br />
              Lng: {loc.lon.toFixed(6)}
            </div>
          </Popup>
        </Marker>

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />

        {route && route.length > 0 && (
          <Polyline positions={route} color="blue" weight={4} />
        )}
      </MapContainer>
    </div>
  );
};

export default CustomerRoute;
