import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  ChatBubbleLeftEllipsisIcon,
  PencilSquareIcon,
} from "@heroicons/react/16/solid";
import { BookmarkIcon, HeartIcon } from "@heroicons/react/24/outline";
import { useChats } from "../contexts/ChatsContext";

function ProfilePage() {
  const navigate = useNavigate();
  const { user, getUser, BASE_API, updateUser, like, logout } = useAuth();
  const { clearChatState } = useChats();
  const otherUserId = useParams()?.otherUserId || user.id;
  const [likedUsers, setLikedUsers] = useState(user?.likedUsers || []);
  const likedOtherUser = likedUsers.includes(Number(otherUserId));
  const [otherUser, setOtherUser] = useState(undefined);
  const isMe = user?.id === otherUser?.id;
  const [allowEdit, setAllowEdit] = useState(false);
  const disableInputs = !isMe || !allowEdit;
  const [isUpdating, setIsUpdating] = useState(false);
  const today = new Date();
  const minDOB = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [about, setAbout] = useState("");
  const [gender, setGender] = useState(null);
  const [orientation, setOrientation] = useState(null);
  const [imageFormData, setImageFormData] = useState({
    profile: undefined,
    background: undefined,
  });
  const [profileImgUrl, setProfileImgUrl] = useState(
    `${BASE_API}/image/${otherUser?.image_urls[1]}`
  );
  const [backgroundImgUrl, setBackgroundImgUrl] = useState(
    `${BASE_API}/image/${otherUser?.image_urls[0]}`
  );
  const [dateOfBirth, setDateOfBirth] = useState(minDOB);

  const initUserState = useCallback(
    function (otherUser) {
      setOtherUser(otherUser);
      setName(otherUser.name);
      setUsername(otherUser.username);
      setAbout(otherUser.about);
      setGender(otherUser.gender);
      setOrientation(otherUser.orientation);
      setBackgroundImgUrl(`${BASE_API}/image/${otherUser.image_urls[1]}`);
      setProfileImgUrl(`${BASE_API}/image/${otherUser.image_urls[0]}`);
      setDateOfBirth(() => {
        try {
          return new Date(otherUser.date_of_birth)
            ?.toISOString?.()
            ?.split?.("T")?.[0];
        } catch {
          return new Date();
        }
      });
    },
    [BASE_API]
  );

  useEffect(
    function () {
      async function setUser() {
        const otherUser = await getUser(otherUserId);
        if (!otherUser) return;
        initUserState(otherUser);
      }
      setUser();
    },
    [getUser, otherUserId, initUserState]
  );

  if (!otherUser || !user) return <PageLoader />;

  function getAge(date) {
    const year = new Date(date).getFullYear();
    const today = new Date().getFullYear();
    const age = today - year;
    return age;
  }

  function handleAllowEdit(state = true) {
    if (!isMe) return;
    setAllowEdit(state);
  }

  async function encodeImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.split(",")[1]); // Strip out the data URL part
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(e) {
    if (!allowEdit) return;

    e.preventDefault();

    let profileImage =
      imageFormData.profile &&
      (await encodeImageToBase64(imageFormData.profile));
    let backgroundImage =
      imageFormData.background &&
      (await encodeImageToBase64(imageFormData.background));

    profileImage = {
      image: profileImage,
      filename: imageFormData?.profile?.name,
    };
    backgroundImage = {
      image: backgroundImage,
      filename: imageFormData?.background?.name,
    };

    const userData = {
      name,
      username,
      about,
      gender,
      orientation,
      backgroundImage,
      profileImage,
      date_of_birth: new Date(dateOfBirth).toISOString().split("T")[0],
    };
    try {
      setIsUpdating(true);
      await updateUser(userData);
    } catch {
      initUserState(otherUser);
    } finally {
      setIsUpdating(false);
      handleAllowEdit(false);
    }
  }

  function handleAddImage(e, isProfile = true) {
    let url;
    const imgs = e.target.files;
    for (let i = 0; i < imgs.length; i++) {
      const image = imgs[i];
      url = URL.createObjectURL(image);
      setImageFormData((images) => {
        return isProfile
          ? { ...images, profile: image }
          : { ...images, background: image };
      });
    }
    return url;
  }

  function handleProfileImage(e) {
    const url = handleAddImage(e);
    setProfileImgUrl(url);
  }

  function handleBackgroundImgUrl(e) {
    const url = handleAddImage(e, false);
    setBackgroundImgUrl(url);
  }

  async function handleLike() {
    if (likedUsers.includes(otherUser.id)) {
      setLikedUsers((likes) =>
        likes.filter((likeId) => likeId !== otherUser.id)
      );
      await like(otherUser.id, true);
    } else {
      setLikedUsers((likes) => [...likes, otherUser.id]);
      await like(otherUser.id);
    }
  }

  async function handleLogout(e) {
    await logout();
    clearChatState();
    navigate("/");
  }

  return (
    <form className="max-h-[100%] overflow-y-auto" onSubmit={handleSubmit}>
      <div
        className="relative h-30 bg-white/10"
        style={{
          backgroundImage: `url('${backgroundImgUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <input
          type="file"
          className="h-full w-full absolute top-0 left-0 opacity-0"
          onChange={handleBackgroundImgUrl}
          accept="image/*"
          disabled={disableInputs}
        />
        <div
          className="w-20 h-20 bg-white/10 rounded-full absolute left-3 bottom-[-40px] overflow-hidden"
          style={{
            backgroundImage: `url('${profileImgUrl}')`,
            backgroundSize: "cover",
          }}
        >
          <input
            type="file"
            className="h-full w-full absolute top-0 left-0 opacity-0"
            onChange={handleProfileImage}
            disabled={disableInputs}
            accept="image/*"
          />
        </div>
      </div>
      <div className="flex justify-end my-3 min-h-6 pr-1">
        {isMe ? (
          allowEdit ? (
            <button
              className={`bg-white text-blue-800 flex items-center gap-2 px-2 py-1 rounded-lg text-sm active:text-blue-400 transition-all ${
                isUpdating ? "text-blue-400" : "text-blue-800"
              }`}
              type="submit"
            >
              <BookmarkIcon className="w-4 h-4" />
              <span className="capitalize whitespace-nowrap">
                {isUpdating ? "updating..." : "Save"}
              </span>
            </button>
          ) : (
            <button
              className="bg-white/10 flex items-center gap-2 px-2 py-1 rounded-lg text-sm"
              onClick={(e) => {
                e.preventDefault();
                handleAllowEdit();
              }}
            >
              <PencilSquareIcon className="w-4 h-4" />
              <span className="capitalize whitespace-nowrap">Edit Profile</span>
            </button>
          )
        ) : (
          <div className="flex bg-white/10 p-2 px-3 rounded-lg gap-6 mr-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleLike();
              }}
              className="active:scale-110"
            >
              <HeartIcon
                className={`h-5 w-5 transition-all ${
                  likedOtherUser
                    ? "stroke-pink-300 fill-pink-300"
                    : "hover:fill-white/37"
                }`}
              />
            </button>
            <Link to={`/app/chats/${otherUserId}`}>
              <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
      <div className="px-1">
        {allowEdit ? (
          <p className="flex gap-1 items-center  bg-white/10 p-2 mb-2">
            <input
              className="text-lg font-semibold max-w-[50%]"
              value={name}
              placeholder="name"
              onChange={(e) => setName(e.target.value)}
              disabled={disableInputs}
            />
            <input
              className="text-base font-bold max-w-[50%]"
              value={"@" + username}
              placeholder="username"
              onChange={(e) => setUsername(e.target.value.replace("@", ""))}
              disabled={disableInputs}
            />
          </p>
        ) : (
          <p className="flex gap-1 items-center  bg-white/10 p-2 mb-2">
            <span className="text-lg font-semibold max-w-[50%]">
              {name || "name"}
            </span>
            <span className="text-base font-bold max-w-[50%]">
              @{username || "username"}
            </span>
          </p>
        )}
        <div className="mb-1 flex flex-col">
          <label className="text-sm font-bold">About</label>
          {allowEdit ? (
            <input
              className="font-extralight text-sm bg-white/10 p-2"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              disabled={disableInputs}
            />
          ) : (
            <p className="font-extralight text-sm bg-white/10 p-2">
              {about || "about"}
            </p>
          )}
        </div>
        <div className="mb-1 flex flex-col">
          <label className="text-sm font-bold">Gender</label>
          {allowEdit ? (
            <select
              className="font-extralight text-sm bg-white/10 p-2"
              disabled={disableInputs}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              defaultValue="male"
              required
            >
              <option className="bg-blue-300" value="" disabled>
                Your gender
              </option>
              <option className="bg-blue-300" value="male">
                male
              </option>
              <option
                disabled={disableInputs}
                className="bg-blue-300"
                value="female"
              >
                female
              </option>
              <option className="bg-blue-300" value="others">
                others
              </option>
            </select>
          ) : (
            <p className="font-extralight text-sm bg-white/10 p-2">
              {gender || "male"}
            </p>
          )}
        </div>
        <div className="mb-1 flex flex-col">
          <label className="text-sm font-bold">Orientation</label>
          {allowEdit ? (
            <select
              id="orientationInput"
              className="font-extralight text-sm bg-white/10 p-2"
              disabled={disableInputs}
              value={orientation}
              onChange={(e) => setOrientation(e.target.value)}
              defaultValue="female"
              required
            >
              <option className="bg-blue-300" value="" disabled>
                Orientation
              </option>
              <option className="bg-blue-300" value="male">
                male
              </option>
              <option className="bg-blue-300" value="female">
                female
              </option>
              <option className="bg-blue-300" value="others">
                others
              </option>
            </select>
          ) : (
            <p className="font-extralight text-sm bg-white/10 p-2">
              {orientation || "female"}
            </p>
          )}
        </div>
        {allowEdit ? (
          <div className="mb-1 flex flex-col">
            <span className="text-sm font-bold">Date Of Birth</span>
            <input
              type="date"
              className="font-extralight text-sm bg-white/10 p-2"
              value={dateOfBirth}
              onChange={(e) =>
                setDateOfBirth(() => {
                  try {
                    return new Date(e.target.value)
                      ?.toISOString?.()
                      ?.split?.("T")?.[0];
                  } catch {
                    return new Date();
                  }
                })
              }
              max={minDOB}
            />
          </div>
        ) : (
          <div className="mb-1 flex flex-col">
            <span className="text-sm font-bold">Age</span>
            <p className="font-extralight text-sm bg-white/10 p-2">
              {`${getAge(dateOfBirth)} Years`}
            </p>
          </div>
        )}
      </div>
      {isMe && (
        <button
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
          className="mx-auto mt-3 flex w-[99%] justify-center bg-white/10 p-2 border-[0.1px] border-white/37 transition-all hover:bg-white/37 active:bg-transparent"
        >
          Logout
        </button>
      )}
    </form>
  );
}

function PageLoader() {
  return (
    <div className="max-h-[100%] overflow-y-auto animate-pulse">
      <div
        className="relative h-30 bg-white/10"
        style={{ backgroundImage: `url('${""}')` }}
      >
        <div
          className="w-20 h-20 bg-white/10 rounded-full absolute left-3 bottom-[-40px]"
          style={{ backgroundImage: `url('${""}')` }}
        ></div>
      </div>
      <div className="flex justify-end my-3">
        <button className="w-20 h-6 bg-white/10"></button>
      </div>
      <div className="h-44 bg-white/10"></div>
    </div>
  );
}

export default ProfilePage;
