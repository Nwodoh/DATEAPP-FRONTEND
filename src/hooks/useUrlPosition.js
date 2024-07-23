import { useSearchParams } from "react-router-dom";

export function useUrlPosition(defaultPosition = []) {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat") || defaultPosition[0];
  const lng = searchParams.get("lng") || defaultPosition[1];

  return [lat, lng];
}
