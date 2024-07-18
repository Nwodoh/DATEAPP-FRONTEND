import { Link } from "react-router-dom";
import styles from "./Logo.module.css";

function Logo() {
  return (
    <Link to="/" className={styles.logo}>
      <img
        src="/fav-icon.png"
        alt="WorldWise logo"
        className={styles.logoImg}
      />
      <p className={styles.logoText}>DateMap</p>
    </Link>
  );
}

export default Logo;
