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
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Button from "./Button";
import Img from "./Img";
import { useAuth } from "../contexts/AuthContext";

function Map() {
  const {
    allUsers,
    getUsersAroundPoint,
    BASE_API,
    like,
    user,
    mapPosition,
    setMapPosition,
  } = useAuth();
  const [likedUsers, setLikedUsers] = useState(user?.likedUsers || []);
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();
  const [mapLat, mapLng] = useUrlPosition(mapPosition);

  useEffect(() => {
    user && setLikedUsers(user.likedUsers || []);
  }, [user]);

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
    [mapLat, mapLng, getUsersAroundPoint, setMapPosition]
  );

  useEffect(
    function () {
      if (geolocationPosition)
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    },
    [geolocationPosition, setMapPosition]
  );

  async function handleLike(userId) {
    if (likedUsers.includes(userId)) {
      setLikedUsers((likes) =>
        likes.reduce((acc, likedId) => {
          if (likedId !== userId) acc.push(likedId);
          return acc;
        }, [])
      );
      await like(userId, true);
    } else {
      setLikedUsers((likes) => [...likes, userId]);
      await like(userId);
    }
  }

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use your position"}
        </Button>
      )}

      <MapContainer
        center={mapPosition}
        zoom={17}
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
                    <button
                      className={
                        likedUsers.includes(user.id)
                          ? styles["action-btn--active"]
                          : ""
                      }
                      data-type="like"
                      onClick={() => handleLike(user.id)}
                    >
                      {likedUsers.includes(user.id) ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                        </svg>
                      )}
                      <span>Like</span>
                    </button>
                    <Link data-type="chat" to={`chats/${user.id}`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M160 368c26.5 0 48 21.5 48 48l0 16 72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6L448 368c8.8 0 16-7.2 16-16l0-288c0-8.8-7.2-16-16-16L64 48c-8.8 0-16 7.2-16 16l0 288c0 8.8 7.2 16 16 16l96 0zm48 124l-.2 .2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3l0-21.3 0-6.4 0-.3 0-4 0-48-48 0-48 0c-35.3 0-64-28.7-64-64L0 64C0 28.7 28.7 0 64 0L448 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64l-138.7 0L208 492z" />
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
