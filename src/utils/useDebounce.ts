/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  dependencies: any[] = [],
): void {
  useEffect(() => {
    const timer = setTimeout(callback, delay)
    return () => clearTimeout(timer)
  }, dependencies)
}
