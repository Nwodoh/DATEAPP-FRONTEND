import { Link } from "react-router-dom";
import Img from "./Img";
import styles from "./LikesProfile.module.css";
import { useAuth } from "../contexts/AuthContext";

function LikesProfile({ user }) {
  const { setMapPosition } = useAuth();

  function handelProfileClick(userLocation) {
    setMapPosition(userLocation);
  }

  return (
    <button
      className={styles.profile}
      onClick={() => {
        handelProfileClick(user.location);
      }}
    >
      <Img classnames={styles.img} imgLink={user.image_urls[0]} />
      <div className={styles.details}>
        <span className={styles.name}>{user.name}</span>
        <span className={styles.username}>@{user.username}</span>
      </div>
      <div className={styles.actions}>
        <Link data-type="chat" to={`/app/chats/${user.id}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M160 368c26.5 0 48 21.5 48 48l0 16 72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6L448 368c8.8 0 16-7.2 16-16l0-288c0-8.8-7.2-16-16-16L64 48c-8.8 0-16 7.2-16 16l0 288c0 8.8 7.2 16 16 16l96 0zm48 124l-.2 .2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3l0-21.3 0-6.4 0-.3 0-4 0-48-48 0-48 0c-35.3 0-64-28.7-64-64L0 64C0 28.7 28.7 0 64 0L448 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64l-138.7 0L208 492z" />
          </svg>
          <span>Chat</span>
        </Link>
      </div>
    </button>
  );
}

export default LikesProfile;
