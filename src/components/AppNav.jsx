import { NavLink } from "react-router-dom";
import styles from "./AppNav.module.css";

function AppNav() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink to="chats">Chats</NavLink>
        </li>
        <li>
          <NavLink to="likes">likes</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default AppNav;
