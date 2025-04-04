import { useAuth } from "../contexts/AuthContext";
import LikesProfile from "./LikesProfile";

// Show an element for each like a user has gotten
function Likes() {
  const { user } = useAuth();
  const numberOfLikes = user?.likes?.length;

  return (
    <div className="flex flex-col h-[100%] overflow-auto relative">
      {numberOfLikes ? (
        <>
          <h2 className="mb-5 text-[18px]">
            {numberOfLikes} {numberOfLikes > 1 ? "People" : "Person"} liked your
            profile
          </h2>
          <div className="flex justify-around flex-wrap">
            {user.likes.map((user, i) => (
              <LikesProfile key={i} user={user} />
            ))}
          </div>
        </>
      ) : (
        <h2>No profile likes yet</h2>
      )}
    </div>
  );
}

export default Likes;
