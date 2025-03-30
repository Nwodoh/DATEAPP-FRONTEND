import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

import { useEffect } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import { useAuth } from "../contexts/AuthContext";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { useChats } from "../contexts/ChatsContext";

function Explorer() {
  const navigate = useNavigate();
  const { setShowExplorer } = useChats();
  const {
    allUsers,
    getUsersAroundPoint,
    BASE_API,
    mapPosition,
    setMapPosition,
  } = useAuth();
  const IMG_API = `${BASE_API}/image`;

  const { position: geolocationPosition } = useGeolocation();
  const [mapLat, mapLng] = useUrlPosition(mapPosition);

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
        setMapPosition([geolocationPosition?.lat, geolocationPosition?.lng]);
    },
    [geolocationPosition, setMapPosition]
  );
  console.log(allUsers);
  return (
    <div className={`self-stretch w-[50vw]`}>
      <MapContainer
        center={mapPosition}
        zoomControl={false}
        zoom={17}
        scrollWheelZoom={true}
        className="h-full relative"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {allUsers.map((user) => (
          <Marker
            position={[user.location[0], user.location[1]]}
            key={user.id}
            icon={L.divIcon({
              className: "custom-marker",
              html: `<div class="marker-wrapper marker-img-wrapper">
                      <div class="marker-img" style="background-image: url('${BASE_API}/image/${user.profile_image}'); background-size: cover;"></div>
                    </div>`,
            })}
            // <img src="${IMG_API}/${user.profile_image}" class="marker-img" />
            eventHandlers={{
              click: () => navigate(`./profile/${user.id}`),
            }}
          />
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
        <button
          type="button"
          className="bg-white z-[999] absolute top-3 right-3 rounded-full overflow-hidden cursor-pointer border-none"
          onClick={() => setShowExplorer(false)}
        >
          <div className="backdrop-blur-md rounded-full overflow-hidden bg-pink-500/80 border-none">
            <div className="bg-[url('/bg/paper.png')] overflow-hidden flex items-center p-2 rounded-full border-none">
              <XMarkIcon className="w-4 h-4 fill-white" />
            </div>
          </div>
        </button>
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

export default Explorer;
