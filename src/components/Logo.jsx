import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full overflow-hidden border-1 border-pink-200/20 py-1 px-3 bg-[url('/bg/paper.png')]"
    >
      {/* <div className="h-10 w-10  flex items-center justify-center rounded-full overflow-hidden"> */}
      <img src="/logo.png" alt="DateMap Logo" className="w-9" />
      {/* </div> */}
      <p className="satisfy-regular tracking-wider text-xl">datemap</p>
    </Link>
  );
}

export default Logo;
