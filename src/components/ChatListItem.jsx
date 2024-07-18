import { Link } from "react-router-dom";
import { useChats } from "../contexts/ChatsContext";
import { useAuth } from "../contexts/AuthContext";
import styles from "./ChatListItem.module.css";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function ChatListItem({ chat }) {
  const { user } = useAuth();
  const { currentChat, deleteCity } = useChats();
  const { message, sender, receiver, timestamp, id } = chat;
  const otherUser = sender.id === user.id ? receiver : sender;

  function handleClick(e) {
    e.preventDefault();
    deleteCity(id);
  }

  return (
    <li>
      <Link
        className={`${styles.chatListItem} ${
          id === currentChat.id ? styles["chatListItem--active"] : ""
        }`}
        // to={`${id}?lat=${location[0]}&lng=${location[1]}`}
      >
        {/* <span className={styles.emoji}>{emoji}</span> */}
        <h3 className={styles.name}>{otherUser.name}</h3>
        <time className={styles.date}>({formatDate(timestamp)})</time>
        <button className={styles.deleteBtn} onClick={handleClick}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default ChatListItem;
