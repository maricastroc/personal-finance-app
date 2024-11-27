import { colors } from './constants'

export const getColorElement = (hex: string) => {
  const color = colors.find((color) => color.hex === hex)

  if (!color) {
    return <span className="text-red-500">Color not found</span>
  }

  return (
    <div className="flex items-center space-x-2">
      <span
        className="w-4 h-4 rounded-full"
        style={{ backgroundColor: color.hex }}
      ></span>
      <span>{color.name}</span>
    </div>
  )
}
