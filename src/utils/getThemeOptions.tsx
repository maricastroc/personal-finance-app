import { colors } from './constants'

export const getThemeOptions = colors.map((color) => ({
  label: (
    <div className="flex items-center space-x-2">
      <span
        className="w-4 h-4 rounded-full"
        style={{ backgroundColor: color.hex }}
      ></span>
      <span>{color.name}</span>
    </div>
  ),
  value: color.hex,
}))
