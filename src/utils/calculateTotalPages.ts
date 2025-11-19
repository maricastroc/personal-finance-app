export function calculateTotalPages(
  totalRecords: number,
  limit: number
): number {
  return Math.ceil(totalRecords / limit);
}
