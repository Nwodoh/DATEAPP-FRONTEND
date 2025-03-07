import { Link } from "react-router-dom";

function GlassCTA({ to, className, children }) {
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
