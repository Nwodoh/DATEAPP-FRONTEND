import { useParams } from "react-router-dom";
import { useChats } from "../contexts/ChatsContext";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { useAuth } from "../contexts/AuthContext";
import { PaperAirplaneIcon } from "@heroicons/react/16/solid";

// This is the page that show the messages between and where you can see and send chats

function ChatPage() {
  const [message, setMessage] = useState("");
  const { otherUserId } = useParams();
  const { BASE_API, user } = useAuth();
  const IMG_API = `${BASE_API}/image`;
  const {
    currentChat,
    activeOtherUser: otherUser,
    getChat,
    isLoadingMessages,
    sendChat,
  } = useChats();
  const userId = user?.id;

  useEffect(
    function () {
      if (!otherUserId) return;
      getChat(otherUserId);
    },
    [getChat, otherUserId]
  );

  function handleSendChat(e) {
    e.preventDefault();
    sendChat(otherUser.id, message);
    setMessage("");
  }

  if (isLoadingMessages || !otherUser?.id || !userId) return <Spinner />;

  return (
    <div className="flex flex-col h-[100%] overflow-hidden relative">
      <header className="absolute top-0 left-0 w-full flex gap-2 items-center">
        <div
          className="h-11 w-11 shrink-0 rounded-full bg-cover bg-white/37 bg-center"
          style={{
            backgroundImage: `url('${IMG_API}/${otherUser.profile_image}')`,
          }}
        ></div>
        <div>
          <span>{otherUser.name}</span>
          <span className="font-semibold"> @{otherUser.username}</span>
        </div>
      </header>
      <section className="grow flex flex-col overflow-y-auto pt-14 px-2">
        {currentChat.map((chat) => (
          <Message chat={chat} userId={userId} key={chat.id} />
        ))}
      </section>
      <form
        onSubmit={handleSendChat}
        className="relative flex items-center justify-center w-[80%] mx-auto"
      >
        <input
          type="text"
          name="message"
          id="chat-message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="w-full bg-white outline-0 rounded-[26px] px-2 py-1.5 text-stone-600"
        />
        <button
          type="submit"
          className={`absolute right-1 top-[50%] translate-y-[-50%] rounded-full p-2 ${
            !!message ? "bg-stone-900" : "bg-stone-400"
          }`}
        >
          <PaperAirplaneIcon className="h-4 w-4 fill-white" />
        </button>
      </form>
    </div>
  );
}

function Message({ chat, userId = "" }) {
  const { message, sender_id } = chat;
  const isSender = userId === sender_id;

  return (
    <div
      className={`flex text-sm w-full mb-1.5 last:mb-0 ${
        isSender ? "justify-end" : "justify-start"
      }`}
    >
      <p
        className={`flex items-center justify-center py-[7px] px-3 max-w-[70%] min-w-10 rounded-[18px] break-words text-white ${
          isSender ? "bg-[#3797f0]" : "bg-pink-500"
        }`}
      >
        {message}
      </p>
    </div>
  );
}

export default ChatPage;
