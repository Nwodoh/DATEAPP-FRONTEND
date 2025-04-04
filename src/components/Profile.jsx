import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// User Profile Image that can be seen on the top-right part of the sidebar when signed in.

function Profile() {
  const { user, isLoading, BASE_API } = useAuth();

  if (isLoading || !user)
    return (
      <div className="rounded-full border-3 border-white/37">
        <div className="w-9 h-9 bg-white/37 rounded-full"></div>
      </div>
    );

  return (
    <Link
      to={`/app/profile/${user.id}`}
      className="flex rounded-full border-3 border-white/37"
    >
      <div
        className="w-9 h-9 bg-white/37 rounded-full overflow-hidden"
        style={{
          backgroundImage: `url('${BASE_API}/image/${user.profile_image}')`,
          backgroundSize: "cover",
        }}
      ></div>
    </Link>
  );
}

export default Profile;
