import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/16/solid";

function LikesProfile({ user }) {
  const { setMapPosition, BASE_API } = useAuth();
  const IMG_API = `${BASE_API}/image`;

  function handelProfileClick(userLocation) {
    setMapPosition(userLocation);
  }

  return (
    <div
      className="flex flex-col items-center w-[43%] rounded bg-white/10 border-[0.1px] border-white/37 p-2.5  mb-6 hover:bg-white/37 transition-all"
      onClick={() => {
        handelProfileClick(user.location);
      }}
    >
      <div
        className={`w-16 h-16 border-[2px] mb-3.5 shrink-0 rounded-full bg-cover bg-white/37 bg-center`}
        style={{
          backgroundImage: `url('${IMG_API}/${user.profile_image}')`,
        }}
      ></div>
      <div className="text-sm max-w-[95%] overflow-hidden whitespace-nowrap text-ellipsis">
        <span className="text-base">{user.name}</span>
        <span className="leading-0">@{user.username}</span>
      </div>
      <Link
        to={`/app/chats/${user.id}`}
        className="mt-1.5 flex items-center justify-around gap-1.5 text-xs py-1.5 rounded-[8px] px-2 transition-all bg-[#26afeb]/15 hover:bg-[#26afeb]/80"
      >
        <ChatBubbleLeftEllipsisIcon className="w-4 h-4" />
        <span>Chat</span>
      </Link>
    </div>
  );
}

export default LikesProfile;
