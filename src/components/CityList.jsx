import CityItem from "./CityItem";
import Message from "./Message";
import Spinner from "./Spinner";
import styles from "./CityList.module.css";
import PropTypes from "prop-types";
import { useCity } from "../contexts/CityContext";

function CityList() {
  const { cities, isLoading } = useCity();
  if (isLoading) return <Spinner />;
  if (!cities.length) return <Message />;
  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

CityList.propTypes = {
  cities: PropTypes.array,
  isLoading: PropTypes.bool,
};

export default CityList;
