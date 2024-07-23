import { Link, useNavigate } from "react-router-dom";
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
import { useChats } from "../contexts/ChatsContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Button from "./Button";
import Img from "./Img";
import { useAuth } from "../contexts/AuthContext";
import { act } from "react";

function Map() {
  const { allUsers, getUsersAroundPoint, BASE_API } = useAuth();
  const { chats } = useChats();
  const [mapPosition, setMapPosition] = useState([6, 5]);
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();
  const [mapLat, mapLng] = useUrlPosition(mapPosition);

  function getAge(date) {
    const year = new Date(date).getFullYear();
    const today = new Date().getFullYear();
    const age = today - year;
    return age;
  }

  useEffect(
    function () {
      setMapPosition([mapLat, mapLng]);
      getUsersAroundPoint([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(function () {});

  useEffect(
    function () {
      if (geolocationPosition)
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    },
    [geolocationPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use your position"}
        </Button>
      )}

      <MapContainer
        center={mapPosition}
        zoom={3}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {allUsers.map((user) => (
          <Marker position={[user.location[0], user.location[1]]} key={user.id}>
            <Popup>
              <div className={styles.mapProfile}>
                <div
                  className={styles.profileImages}
                  style={{
                    backgroundImage: `url('${BASE_API}/image/${user.image_urls[0]}')`,
                  }}
                >
                  <Img imgLink={user.image_urls[0]} />
                </div>
                <div className={styles.profileDetails}>
                  <div className={styles.names}>
                    <span>{user.name}</span>
                    <span>@{user.username}</span>
                  </div>
                  <div>
                    <span className={styles.infoElement}>{user.gender}</span>
                    <span className={styles.infoElement}>
                      {getAge(user.date_of_birth)} Years
                    </span>
                  </div>
                  {user.about && (
                    <div>
                      <span>{user.about}</span>
                    </div>
                  )}
                  <div className={styles.actions}>
                    <button data-type="like">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                      >
                        <path d="M480-147q-14 0-28.5-5T426-168l-69-63q-106-97-191.5-192.5T80-634q0-94 63-157t157-63q53 0 100 22.5t80 61.5q33-39 80-61.5T660-854q94 0 157 63t63 157q0 115-85 211T602-230l-68 62q-11 11-25.5 16t-28.5 5Zm-38-543q-29-41-62-62.5T300-774q-60 0-100 40t-40 100q0 52 37 110.5T285.5-410q51.5 55 106 103t88.5 79q34-31 88.5-79t106-103Q726-465 763-523.5T800-634q0-60-40-100t-100-40q-47 0-80 21.5T518-690q-7 10-17 15t-21 5q-11 0-21-5t-17-15Zm38 189Z" />
                      </svg>
                      <span>Like</span>
                    </button>
                    <Link data-type="chat" to={`chats/${user.id}`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                      >
                        <path d="m240-240-92 92q-19 19-43.5 8.5T80-177v-623q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240Zm-34-80h594v-480H160v525l46-45Zm-46 0v-480 480Zm160-200q17 0 28.5-11.5T360-560q0-17-11.5-28.5T320-600q-17 0-28.5 11.5T280-560q0 17 11.5 28.5T320-520Zm160 0q17 0 28.5-11.5T520-560q0-17-11.5-28.5T480-600q-17 0-28.5 11.5T440-560q0 17 11.5 28.5T480-520Zm160 0q17 0 28.5-11.5T680-560q0-17-11.5-28.5T640-600q-17 0-28.5 11.5T600-560q0 17 11.5 28.5T640-520Z" />
                      </svg>
                      <span>Chat</span>
                    </Link>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => navigate(`chats?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
