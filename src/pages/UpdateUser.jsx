import { useEffect, useState } from "react";
import PageNav from "../components/PageNav";
import { useAuth } from "../contexts/AuthContext";
import styles from "./UpdateUser.module.css";

function UpdateUser() {
  const { user } = useAuth();
  const [name, setName] = useState("");

  useEffect(
    function () {
      user?.location && setName(user.location);
    },
    [user]
  );

  return (
    <main className={styles.page}>
      <PageNav />
      <form>
        <input value={name} onChange={(e) => setName(e.value)} />
      </form>
    </main>
  );
}

export default UpdateUser;
