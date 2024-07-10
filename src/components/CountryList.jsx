import CountryItem from "./CountryItem";
import Message from "./Message";
import Spinner from "./Spinner";
import styles from "./CountryList.module.css";
import PropTypes from "prop-types";
import { useCity } from "../contexts/CityContext";

function CountryList() {
  const { cities, isLoading } = useCity();
  const countries = cities.reduce((acc, curr) => {
    const { country, emoji } = curr;
    if (acc.some((item) => item?.country === country)) return acc;
    else acc.push({ country, emoji });
    return acc;
  }, []);

  if (isLoading) return <Spinner />;
  if (!cities.length)
    return <Message message="Add your first City By Clicking on the Map." />;
  return (
    <ul className={styles.countryList}>
      {countries?.map((country, i) => (
        <CountryItem country={country} key={i} />
      ))}
    </ul>
  );
}

CountryList.propTypes = {
  cities: PropTypes.array,
  isLoading: PropTypes.bool,
};

export default CountryList;
