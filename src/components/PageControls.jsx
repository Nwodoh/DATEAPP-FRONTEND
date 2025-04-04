import { useState } from "react";
import Color from "color";

function getRGB(color) {
  try {
    const parsedColor = Color(color); // Parse the color
    const { r, g, b } = parsedColor.rgb().object(); // Extract RGB values
    return `${r}, ${g}, ${b}`;
  } catch {
    throw new Error(`Invalid color format: ${color}`);
  }
}

// Component that is used by the AppNav component to show the navigation (chat, like, explore)

export default function PageControls({
  labels = [],
  color = "#123524",
  activeIndex = 0,
  handleClick,
}) {
  const [trueActiveIndex, setTrueActiveIndex] = useState(activeIndex);
  const rgb = getRGB(color);
  return (
    <div
      style={{
        border: `1px solid rgba(${rgb}, 0.37)`,
        backgroundColor: `rgba(${rgb}, 0.1)`,
      }}
      className={`min-w-[261px] flex justify-between p-[3.5px] rounded-full`}
    >
      {labels.map((label, i) => {
        const isActive = i === trueActiveIndex;
        return (
          <button
            key={i}
            style={{
              color: isActive ? `rgb(${rgb})` : `rgba(${rgb}, 0.37)`,
              backgroundColor: isActive ? `rgba(${rgb}, 0.37)` : ``,
            }}
            className={`grow capitalize text-sm pt-[6.78px] pb-[5.8px] rounded-full transition-[background-color,_color,_font-weight] duration-200 ease-in-out ${
              isActive ? `font-semibold shadow-sgc` : "font-medium"
            }`}
            onClick={() => {
              setTrueActiveIndex(i);
              handleClick(label);
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
