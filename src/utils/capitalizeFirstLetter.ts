export function capitalizeFirstLetter(word: string | undefined) {
  if (!word) return word
  return word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLowerCase()
}
