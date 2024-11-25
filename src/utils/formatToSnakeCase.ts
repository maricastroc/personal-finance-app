export function formatToSnakeCase(text: string | null | undefined): string {
  if (!text) {
    return ''
  }

  return text.toLowerCase().replace(/\s+/g, '_')
}
