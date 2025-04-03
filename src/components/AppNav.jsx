import { useNavigate } from "react-router-dom";
import { useChats } from "../contexts/ChatsContext";
import PageControls from "./PageControls";

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
