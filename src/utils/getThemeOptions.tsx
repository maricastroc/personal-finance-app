import { colors } from "./constants";

export const getThemeOptions = colors.map((color) => ({
  label: (
    <div className="flex items-center space-x-2">
      <span
        className={`w-4 mr-2 h-4 rounded-full ${
          color.name.toLowerCase() === "white" ? "border border-grey-900" : ""
        }`}
        style={{ backgroundColor: color.hex, marginRight: 4 }}
      ></span>
      <span>{color.name}</span>
    </div>
  ),
  value: color.hex,
}));
