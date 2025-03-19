import { useAuth } from "../contexts/AuthContext";
import Img from "./Img";
import SpinnerFullPage from "./SpinnerFullPage";

function Profile() {
  const { user, isLoading } = useAuth();
  // const { user, logout, isLoading } = useAuth();
  // const { clearChatState } = useChats();
  // const navigate = useNavigate();

  // async function handleClick() {
  //   await logout();
  //   clearChatState();
  //   navigate("/");
  // }

  if (isLoading || !user) return <SpinnerFullPage />;

  return (
    <div className="rounded-full border-3 border-white/37">
      <Img
        classnames="w-9 rounded-full"
        imgLink={user.image_urls[0]}
        alt={user.name}
      />
    </div>
  );
}

export default Profile;
