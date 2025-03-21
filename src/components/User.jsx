import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "./User.module.css";
import Img from "./Img";
import SpinnerFullPage from "./SpinnerFullPage";
import { useChats } from "../contexts/ChatsContext";

function User() {
  const { user, logout, isLoading } = useAuth();
  const { clearChatState } = useChats();
  const navigate = useNavigate();

  async function handleClick() {
    await logout();
    clearChatState();
    navigate("/");
  }

  if (isLoading || !user) return <SpinnerFullPage />;

  return (
    <div className={styles.user}>
      <Img imgLink={user.image_urls[0]} alt={user.name} />
      <span>Welcome, {user.name}</span>
      <button onClick={handleClick}>Logout</button>
    </div>
  );
}

export default User;

/*
CHALLENGE

1) Add `AuthProvider` to `App.jsx`
2) In the `Login.jsx` page, call `login()` from context
3) Inside an effect, check whether `isAuthenticated === true`. If so, programatically navigate to `/app`
4) In `User.js`, read and display logged in user from context (`user` object). Then include this component in `AppLayout.js`
5) Handle logout button by calling `logout()` and navigating back to `/`
*/
