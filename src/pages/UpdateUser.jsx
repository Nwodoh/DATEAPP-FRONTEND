import { useEffect, useState } from "react";
import PageNav from "../components/PageNav";
import { useAuth } from "../contexts/AuthContext";
import styles from "./UpdateUser.module.css";
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
  const [imageFormData, setImageFormData] = useState({
    profile: undefined,
    background: undefined,
  });
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const [backgroundImgUrl, setBackgroundImgUrl] = useState("");
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
        setProfileImgUrl(
          user.image_urls.length
            ? `${BASE_API}/image/${user.image_urls[0]}`
            : ""
        );
      user?.image_urls &&
        setBackgroundImgUrl(
          user.image_urls.length
            ? `${BASE_API}/image/${user.image_urls[1]}`
            : ""
        );
    },
    [user]
  );

  async function encodeImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.split(",")[1]); // Strip out the data URL part
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let profileImage =
      imageFormData.profile &&
      (await encodeImageToBase64(imageFormData.profile));
    let backgroundImage =
      imageFormData.background &&
      (await encodeImageToBase64(imageFormData.background));

    profileImage = {
      image: profileImage,
      filename: imageFormData?.profile?.name,
    };
    backgroundImage = {
      image: backgroundImage,
      filename: imageFormData?.background?.name,
    };

    const userData = {
      name,
      username,
      about,
      gender,
      orientation,
      backgroundImage,
      profileImage,
      date_of_birth: dateOfBirth,
    };
    await updateUser(userData);
    navigate("/app/chats");
  }

  function handleAddImage(e, isProfile = true) {
    let url;
    const imgs = e.target.files;
    for (let i = 0; i < imgs.length; i++) {
      const image = imgs[i];
      url = URL.createObjectURL(image);
      setImageFormData((images) => {
        return isProfile
          ? { ...images, profile: image }
          : { ...images, background: image };
      });
    }
    return url;
  }

  function handleProfileImage(e) {
    const url = handleAddImage(e);
    setProfileImgUrl(url);
  }

  function handleBackgroundImgUrl(e) {
    const url = handleAddImage(e, false);
    setBackgroundImgUrl(url);
  }

  return (
    <main className={styles.page}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.images}>
          <div className={styles.profileImage}>
            <img src={profileImgUrl} alt={name} />
            <input type="file" onChange={handleProfileImage} accept="image/*" />
          </div>
          <div
            className={styles.backgroundImg}
            style={{
              backgroundImage: `url('${backgroundImgUrl}')`,
            }}
          >
            <input
              type="file"
              onChange={handleBackgroundImgUrl}
              accept="image/*"
            />
          </div>
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
