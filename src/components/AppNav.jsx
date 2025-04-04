import { useNavigate } from "react-router-dom";
import { useChats } from "../contexts/ChatsContext";
import PageControls from "./PageControls";

// NAvigation for the application. It uses the PageControls component to display buttons for the chat, like and explore pages.
function AppNav({ className }) {
  const { setShowExplorer } = useChats();
  const navigate = useNavigate();

  function handleClick(label = "") {
    if (label === "explore") setShowExplorer(true);
    else navigate(`./${label.toLowerCase()}`);
  }

  return (
    <nav className={className}>
      <PageControls
        labels={["Chats", "likes", "explore"]}
        color="white"
        handleClick={handleClick}
      />
    </nav>
  );
}

export default AppNav;
