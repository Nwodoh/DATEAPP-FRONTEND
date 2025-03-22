import Explorer from "../components/Map";
import Sidebar from "../components/Sidebar";
import { useChats } from "../contexts/ChatsContext";

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
