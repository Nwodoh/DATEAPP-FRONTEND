import { Link } from "react-router-dom";
import { useChats } from "../contexts/ChatsContext";
import styles from "./ChatListItem.module.css";
import Img from "./Img";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function ChatListItem({ chat }) {
  const { activeChat } = useChats();
  const { message, timestamp, other_user: otherUser } = chat;

  return (
    <li>
      <Link
        className={`${styles.chatListItem} ${
          otherUser.id === activeChat ? styles["chatListItem--active"] : ""
        }`}
        to={`./${otherUser.id}`}
      >
        <Img
          classnames={`${styles.profileImg}`}
          imgLink={otherUser.image_urls[0]}
          alt={otherUser.name}
        />
        <div className={styles.chatContent}>
          <div className={styles.chatDetails}>
            <h3 className={styles.name}>
              {otherUser.name}
              <span className={styles.date}> @{otherUser.username}</span>
            </h3>
            <time className={styles.date}>{formatDate(timestamp)}</time>
          </div>
          <p className={styles.message}>{message}</p>
        </div>
      </Link>
    </li>
  );
}

export default ChatListItem;
