import { useNavigate, useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import { useCity } from "../contexts/CityContext";
import Button from "./Button";
import { useGeoLocation } from "../hooks/useGeoLocation";
import useUrlPosition from "../hooks/useUrlPosition";

function Map() {
  const { cities } = useCity();
  const {
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
    getPosition,
  } = useGeoLocation();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const [mapLat, mapLng] = useUrlPosition();

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      const { lat, lng } = geoLocationPosition;
      if (typeof lat === "number" && typeof lng === "number") {
        setMapPosition([lat, lng]);
      }
    },
    [geoLocationPosition]
  );

  function handleGetPosition() {
    getPosition();
  }

  return (
    <div className={styles.mapContainer}>
      {typeof geoLocationPosition?.lat !== "number" ? (
        <Button type="position" onClick={() => handleGetPosition()}>
          {isLoadingPosition ? "Loading..." : "Use Your Location."}
        </Button>
      ) : (
        ""
      )}
      <MapContainer
        center={mapPosition}
        zoom={4}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city, i) => {
          const {
            cityName: name,
            emoji,
            position: { lat, lng },
          } = city;
          return (
            <Marker position={[lat, lng]} key={i}>
              <Popup>
                <span>{emoji}</span>
                <span>{name}</span>
              </Popup>
              <ChangMapView position={mapPosition} />
              <DetectClick />
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

function ChangMapView({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      const {
        latlng: { lat, lng },
      } = e;
      navigate(`form?lat=${lat}&lng=${lng}`);
    },
  });
}

ChangMapView.propTypes = {
  position: PropTypes.array,
};

export default Map;
