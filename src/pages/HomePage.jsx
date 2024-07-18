import { Link } from "react-router-dom";
import PageNav from "../components/PageNav";
import styles from "./Homepage.module.css";

export default function Homepage() {
  return (
    <main className={styles.homepage}>
      {/* <GlassBkg /> */}
      <PageNav />
      <section>
        <h1>
          <span className="u-color-brand-2">Meet New People.</span>
          <br />
          <span className="u-color-brand-2">Unlock new Possibilites.</span>
        </h1>
        <h2>
          A dating app that shows a map of new and interesting people around
          you, in different cities, enabling you form relationships around the
          world.
        </h2>
        <Link to="/login" className="cta">
          Join Now
        </Link>
      </section>
    </main>
  );
}
