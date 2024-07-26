import { useParams } from "react-router-dom";
import { useChats } from "../contexts/ChatsContext";
import styles from "./ChatPage.module.css";
import Img from "./Img";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { useAuth } from "../contexts/AuthContext";

function ChatPage() {
  // const otherUserFromChat = chats.find(
  //   (chat) => chat.other_user.id === Number(otherUserId)
  // )?.other_user;
  const [message, setMessage] = useState("");
  const [otherUser, setOtherUser] = useState({});
  const { otherUserId } = useParams();
  const { getUser } = useAuth();
  const { currentChat, chats, getChat, isLoading, sendChat } = useChats();

  useEffect(
    function () {
      async function storeOtherUser(otherUserId) {
        const otherUser =
          chats.find((chat) => chat.other_user.id === Number(otherUserId))
            ?.other_user || (await getUser(otherUserId));
        setOtherUser(otherUser);
      }

      async function initOtherUser() {
        await storeOtherUser(otherUserId);
      }
      initOtherUser();
    },
    [otherUserId, chats, getUser]
  );

  useEffect(
    function () {
      if (!otherUser?.id) return;
      !isLoading && getChat(otherUser?.id);
    },
    [getChat, chats, otherUser]
  );

  function handleSendChat(e) {
    e.preventDefault();
    sendChat(otherUser.id, message);
    setMessage("");
  }

  if (isLoading || !otherUser?.id) return <Spinner />;

  return (
    <div className={styles.chatPage}>
      <header className={styles.chatHeader}>
        <Img classnames={styles.profileImg} imgLink={otherUser.image_urls[0]} />
        <span>
          <h3>
            {otherUser.name} <span className=""> @{otherUser.username}</span>
          </h3>
        </span>
      </header>
      <section className={styles.chatBody}>
        <div className={styles.chatContainer}>
          {currentChat.map((chat) => (
            <Message chat={chat} key={chat.id} />
          ))}
        </div>
      </section>
      <footer className={styles.chatFooter}>
        <form onSubmit={handleSendChat}>
          <input
            type="text"
            name="message"
            id="chat-message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
              <path d="M792-443 176-183q-20 8-38-3.5T120-220v-520q0-22 18-33.5t38-3.5l616 260q25 11 25 37t-25 37ZM200-280l474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
}

function Message({ chat }) {
  const { message, is_sender: isSender = false } = chat;

  return (
    <div
      className={`${styles.message} ${
        isSender ? styles.messageSent : styles.messageReceived
      }`}
    >
      <p>{message}</p>
    </div>
  );
}

export default ChatPage;
