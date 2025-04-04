import { useCallback } from "react";

// useGeolocation hook provides a function to retrieve the user's current geolocation coordinates (latitude, longitude).
// It handles errors if geolocation is not supported or fails.

export function useGeolocation(defaultPosition = null) {
  const getPosition = useCallback(async function () {
    try {
      if (!navigator.geolocation)
        throw new Error("Your browser does not support geolocation");

      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );

      return [pos.coords.latitude, pos.coords.longitude];
    } catch (err) {
      console.error(err);
    }
  }, []);

  return { getPosition };
}
