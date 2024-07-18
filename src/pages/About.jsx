// Uses the same styles as Product
import PageNav from "../components/PageNav";
import styles from "./About.module.css";

export default function About() {
  return (
    <main className={styles.product}>
      <PageNav />
      <section></section>
    </main>
  );
}
