import { colors } from './constants'

export const getThemeOptions = colors.map((color) => ({
  label: (
    <div className="flex items-center space-x-2">
      <span
        className={`w-4 mr-2 h-4 rounded-full ${
          color.name.toLowerCase() === 'white' ? 'border border-gray-800' : ''
        }`}
        style={{ backgroundColor: color.hex }}
      ></span>
      <span>{color.name}</span>
    </div>
  ),
  value: color.hex,
}))
