import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Img from "./Img";

function Profile() {
  const { user, isLoading } = useAuth();

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
      <Img
        classnames="w-9 h-9 bg-white/37 rounded-full"
        imgLink={user.image_urls[0]}
        alt={user.name}
      />
    </Link>
  );
}

export default Profile;
