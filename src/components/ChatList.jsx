import Spinner from "./Spinner";
import ChatListItem from "./ChatListItem";
import Message from "./Message";
import { useChats } from "../contexts/ChatsContext";

function ChatList() {
  const { chats, isLoading } = useChats();

  if (isLoading) return <Spinner />;

  if (!chats.length)
    return <Message message="Chat with someone new by clicking on the map." />;

  return (
    <ul className="max-h-[100%] flex flex-col grow overflow-y-auto">
      {chats.map((chat) => (
        <ChatListItem chat={chat} key={chat.other_user.id} />
      ))}
    </ul>
  );
}

export default ChatList;
