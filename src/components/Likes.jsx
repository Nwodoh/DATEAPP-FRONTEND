import { useAuth } from "../contexts/AuthContext";
import styles from "./Likes.module.css";
import LikesProfile from "./LikesProfile";

function Likes() {
  const { user } = useAuth();
  const numberOfLikes = user?.likes?.length;

  return (
    <>
      {numberOfLikes ? (
        <>
          <h2 className={styles.heading}>
            {numberOfLikes} {numberOfLikes > 1 ? "People" : "Person"} liked your
            profile
          </h2>
          <div className={styles.likes}>
            {user.likes.map((user, i) => (
              <LikesProfile key={i} user={user} />
            ))}
          </div>
        </>
      ) : (
        <h2>No profile likes yet</h2>
      )}
    </>
  );
}

export default Likes;
