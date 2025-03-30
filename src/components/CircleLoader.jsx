function CircleLoader({
  size = 60,
  color = "#ffffff",
  iterationCount = "infinite",
  animationDuration = "1s",
  animationTimingFunction = "linear",
}) {
  const designedSize = 60;
  const scale = size / designedSize;
  if (typeof iterationCount === "number" && iterationCount < 1) return;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-spin"
      style={{
        animationIterationCount: iterationCount,
        animationDuration,
        animationTimingFunction,
      }}
    >
      {" "}
      <path
        d={` M${30 * scale} ${2 * scale} C${33.677 * scale} ${2 * scale}, ${
          37.318 * scale
        } ${2.72424 * scale}, ${40.7151 * scale} ${4.13137 * scale} C${
          44.1123 * scale
        } ${5.53851 * scale}, ${47.199 * scale} ${7.60097 * scale}, ${
          49.799 * scale
        } ${10.201 * scale} C${52.399 * scale} ${12.8011 * scale}, ${
          54.4615 * scale
        } ${15.8878 * scale}, ${55.8686 * scale} ${19.2849 * scale} C${
          57.2758 * scale
        } ${22.682 * scale}, ${58 * scale} ${26.323 * scale}, ${58 * scale} ${
          30 * scale
        }`}
        stroke={color}
        strokeWidth={4 * scale}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={200 * scale}
      />{" "}
    </svg>
  );
}
export default CircleLoader;
