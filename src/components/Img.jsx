import { useAuth } from "../contexts/AuthContext";
function Img({ classnames, imgLink, alt = "" }) {
  const { BASE_API } = useAuth();
  const IMG_API = `${BASE_API}/image`;
  return <img className={classnames} src={`${IMG_API}/${imgLink}`} alt={alt} />;
}

export default Img;
