import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

import { useCallback, useEffect, useState } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import { useAuth } from "../contexts/AuthContext";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { useChats } from "../contexts/ChatsContext";
import { MagnifyingGlass } from "@phosphor-icons/react";

// Handles all functionalities that can be seen on the Explore component


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
  return (
    <div className={`relative self-stretch w-[50vw]`}>
      {/* Search Component */}
      <Search setMapPosition={setMapPosition} />
      {/* Map Component From leaflet-react a third party library for maps */}
      <MapContainer
        center={mapPosition}
        zoomControl={false}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full relative"
      >
        {/* TileLayer shows the actual map image that makes up the countries that can be seen */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {/* For Each in the DB, we create a profile image on the map displayed on their location. This image can then be to open their profile */}
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
            eventHandlers={{
              click: () => navigate(`./profile/${user.id}`),
            }}
          />
        ))}
        <ChangeCenter position={mapPosition} />
        {/* Detects a map click and scrolls to wherever was clicked */}
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

function Search({ setMapPosition }) {
  const navigate = useNavigate();
  const { BASE_API, USER_API } = useAuth();
  const IMG_API = `${BASE_API}/image`;
  const [searchQuery, setSearchQuery] = useState("");

  const [results, setResults] = useState([]);

  const handleSearch = useCallback(
    async function (value = "") {
      if (!value.length) return;

      const res = await fetch(`${USER_API}/search/${value}`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("login-token")}`,
        },
      });

      const data = await res.json();

      if (data.status !== "success") throw new Error();
      setResults(data.results);
    },
    [USER_API]
  );

  useEffect(
    function () {
      if (searchQuery.length > 0) handleSearch(searchQuery);
    },
    [searchQuery, handleSearch]
  );

  return (
    <div className="z-[99999] absolute top-5 left-3 flex flex-col gap-2">
      <div className="backdrop-blur-md bg-blue-800/80 rounded-[10px] overflow-hidden">
        <label className=" bg-[url('/bg/paper.png')] flex items-center gap-[7px] p-[7px]">
          <MagnifyingGlass className="fill-white w-5 h-5" />
          <input
            type="text"
            placeholder="Search"
            className="text-white outline-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>
      </div>
      {results.length && (
        <div className="backdrop-blur-md bg-blue-800/80 rounded-[10px] overflow-hidden">
          {results.map((result) => (
            <button
              className="w-full flex gap-2 items-center py-2 mx-2 border-0 border-b-[0.1px] border-b-white/10 last:border-b-0"
              onClick={(e) => {
                navigate(`./profile/${result.id}`);
                setMapPosition(result.location);
              }}
            >
              <div
                className="h-8 w-8 shrink-0 rounded-full bg-cover bg-white/37 bg-center"
                style={{
                  backgroundImage: `url('${IMG_API}/${result.profile_image}')`,
                }}
              ></div>
              <div className="">
                <span>{result.name}</span>
                <span className="font-semibold"> @{result.username}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Explorer;
