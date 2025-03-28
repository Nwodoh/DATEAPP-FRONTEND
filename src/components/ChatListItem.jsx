import { Link } from "react-router-dom";
import { useChats } from "../contexts/ChatsContext";
import { useAuth } from "../contexts/AuthContext";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function ChatListItem({ chat }) {
  const { BASE_API } = useAuth();
  const IMG_API = `${BASE_API}/image`;
  const { activeChat } = useChats();
  const { message, timestamp, other_user: otherUser } = chat;
  const isActiveChat = otherUser.id === activeChat;

  return (
    <li className="border-b-[0.1px] border-b-white/27 last:border-b-transparent">
      <Link
        className={`flex items-center gap-2 text-base py-4 ${
          isActiveChat ? "border-none border-l-[2px] border-l-white" : ""
        }`}
        to={`./${otherUser.id}`}
      >
        <div
          className="h-11 w-11 shrink-0 rounded-full bg-cover bg-white/37 bg-center"
          style={{
            backgroundImage: `url('${IMG_API}/${otherUser.image_urls[0]}')`,
          }}
        ></div>
        <div className="flex flex-col grow">
          <div className="flex">
            <h3 className="mr-auto text-[17px] font-semibold">
              <span>{otherUser.name}</span>
              <span className="text-sm"> @{otherUser.username}</span>
            </h3>
            <time className="text-sm">{formatDate(timestamp)}</time>
          </div>
          <p className="overflow-hidden whitespace-nowrap text-ellipsis max-w-[90%] text-sm">
            {message}
          </p>
        </div>
      </Link>
    </li>
  );
}

export default ChatListItem;
