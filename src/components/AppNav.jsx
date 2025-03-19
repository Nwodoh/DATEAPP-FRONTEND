import { useNavigate } from "react-router-dom";
import PageControls from "./PageControls";

function AppNav({ className }) {
  const navigate = useNavigate();

  function handleClick(lable = "") {
    navigate(`./${lable.toLowerCase()}`);
  }

  return (
    <nav className={className}>
      <PageControls
        labels={["Chats", "likes", "map"]}
        color="white"
        handleClick={handleClick}
      />
    </nav>
  );
}

export default AppNav;
