import Explorer from "../components/Map";
import Sidebar from "../components/Sidebar";
import { useChats } from "../contexts/ChatsContext";

// This is the layout fo the main app.
// The side bar is where chats, profile and likes are displayed and the explorer contains the map and search component. The Explorer can be closed or opened
function AppLayout() {
  const { showExplorer } = useChats();

  return (
    <div className="h-svh flex items-center justify-center">
      <div className="backdrop-blur-md overflow-hidden rounded-xl bg-blue-800/80">
        <div className="bg-[url('/bg/paper.png')] rounded-xl overflow-hidden flex items-center">
          <Sidebar />
          {showExplorer && <Explorer />}
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
