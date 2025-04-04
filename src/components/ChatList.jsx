import Spinner from "./Spinner";
import ChatListItem from "./ChatListItem";
import Message from "./Message";
import { useChats } from "../contexts/ChatsContext";

// Shows a list of people a user has chatted with and if none, it displays a message.
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
