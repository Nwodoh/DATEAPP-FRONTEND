import { useEffect, useState } from "react";
import PageNav from "../components/PageNav";
import { useAuth } from "../contexts/AuthContext";
import styles from "./UpdateUser.module.css";
import Img from "../components/Img";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

function UpdateUser() {
  const navigate = useNavigate();
  const { user, BASE_API, updateUser } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [about, setAbout] = useState("");
  const [gender, setGender] = useState("");
  const [orientation, setOrientation] = useState("");
  const [imageUrls, setImageUrls] = useState(["", ""]);
  const [dateOfBirth, setDateOfBirth] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(
    function () {
      user?.name && setName(user.name);
      user?.username && setUsername(user.username);
      user?.about && setAbout(user.about);
      user?.gender && setGender(user.gender);
      user?.orientation && setOrientation(user.orientation);
      user?.image_urls &&
        setImageUrls(
          user.image_urls.length
            ? [
                `${BASE_API}/image/${user.image_urls[0]}`,
                `${BASE_API}/image/${user.image_urls[1]}`,
              ]
            : ["", ""]
        );
    },
    [user]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    const userData = { name, username, about, gender, orientation };
    await updateUser(userData);
    console.log({ name, username, about, gender, orientation });
    navigate("/app/chats");
  }

  function handleAddImage(e) {
    const imgs = e.target.files;
    // const data = new FormData();
    for (let i = 0; i < imgs.length; i++) {
      // data.append("photos", files[i]);
      const url = URL.createObjectURL(imgs[i]);
      setImageUrls((urls) => {
        return [url, ...urls];
      });
    }
  }

  return (
    <main className={styles.page}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.images}>
          <img src={imageUrls[0]} alt={name} className={styles.profileImage} />
          <div
            className={styles.backgroundImg}
            style={{
              backgroundImage: `url('${imageUrls[1]}')`,
            }}
          ></div>
          <input
            type="file"
            onChange={handleAddImage}
            accept="image/*"
            multiple
          />
        </div>
        <input
          value={name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          value={about}
          placeholder="A short note on yourself"
          maxLength={300}
          onChange={(e) => setAbout(e.target.value)}
          required
        />
        <div className={styles.shortInputs}>
          <select
            id="genderInput"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="" disabled>
              Your gender
            </option>
            <option value="male">male</option>
            <option value="female">female</option>
            <option value="others">others</option>
          </select>
          <select
            id="orientationInput"
            value={orientation}
            onChange={(e) => setOrientation(e.target.value)}
            required
          >
            <option value="" disabled>
              Orientation
            </option>
            <option value="male">male</option>
            <option value="female">female</option>
            <option value="others">others</option>
          </select>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
        </div>
        <div className={styles.actions}>
          <Button type="primary">Update</Button>
        </div>
      </form>
    </main>
  );
}

export default UpdateUser;
