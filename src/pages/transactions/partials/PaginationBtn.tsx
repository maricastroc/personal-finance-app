import { CaretLeft, CaretRight } from 'phosphor-react'
import { ButtonHTMLAttributes } from 'react'

interface PaginationBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  number: number
  variant?: 'default' | 'left' | 'right'
}

export function PaginationBtn({
  number,
  variant = 'default',
  ...rest
}: PaginationBtnProps) {
  let content

  switch (variant) {
    case 'default':
      content = number
      break
    case 'left':
      content = <CaretLeft />
      break
    case 'right':
      content = <CaretRight />
      break
    default:
      content = number
  }

  return (
    <button
      className="rounded-md flex items-center gap-3 border border-gray-900 h-10 min-w-10 justify-center bg-gray-900 text-beige-100 px-3 hover:bg-gray-900 hover:text-beige-100 disabled:bg-gray-400 disabled:border-gray-400 disabled:text-gray-100 disabled:cursor-not-allowed transition-all duration-500"
      {...rest}
    >
      {content}
    </button>
  )
}
