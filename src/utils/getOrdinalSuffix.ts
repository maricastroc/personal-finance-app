export function getOrdinalSuffix(num: string): string {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const exception = [11, 12, 13]

  const lastDigit = parseFloat(num) % 10
  const lastTwoDigits = parseFloat(num) % 100

  if (exception.includes(lastTwoDigits)) {
    return `${num}th`
  }

  return `${num}${suffixes[lastDigit] || suffixes[0]}`
}
