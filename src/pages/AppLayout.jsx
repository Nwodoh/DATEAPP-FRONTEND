import Sidebar from "../components/Sidebar";

function AppLayout() {
  return (
    <div className={`h-svh flex items-center justify-center`}>
      <div
        className={`backdrop-blur-md overflow-hidden rounded-xl bg-blue-800/80`}
      >
        <div className={`bg-[url('/bg/paper.png')] rounded-xl overflow-hidden`}>
          <Sidebar />
          {/* <Map /> */}
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
