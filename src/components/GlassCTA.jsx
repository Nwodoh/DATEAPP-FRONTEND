import { Link } from "react-router-dom";
import CircleLoader from "./CircleLoader";

function GlassCTA({ to, className = "", type, children, isLoading = false }) {
  if (type === "button")
    return (
      <button
        type="submit"
        disabled={isLoading}
        className={`relative btn-glass rounded-[20px] before:rounded-[20px] after:rounded-full before:bg-blue-800/80 before:backdrop-blur-sm space-x-2 ${className}`}
      >
        <span className={`${isLoading ? "opacity-0" : "opacity-100"}`}>
          {children}
        </span>
        <span
          className={`absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] ${
            isLoading ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <CircleLoader size={20} />
        </span>
      </button>
    );

  return (
    <Link
      to={to}
      className={`btn-glass rounded-[20px] before:rounded-[20px] after:rounded-full before:bg-blue-800/80 before:backdrop-blur-sm space-x-2 ${className}`}
    >
      {children}
    </Link>
  );
}

export default GlassCTA;
