import Map from "../components/Map";
import Sidebar from "../components/Sidebar";
import User from "../components/User";

function AppLayout() {
  return (
    <div>
      <Sidebar />
      <Map />
      <User />
    </div>
  );
}

export default AppLayout;
