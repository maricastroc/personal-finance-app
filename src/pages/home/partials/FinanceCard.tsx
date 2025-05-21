import { SkeletonFinanceCard } from '@/components/skeletons/SkeletonFinanceCard'
import { ReactNode } from 'react'

interface FinanceCardProps {
  title: string
  value: string
  variant?: 'primary' | 'secondary' | 'tertiary'
  isValidating?: boolean
  icon?: ReactNode
}

export function FinanceCard({
  title,
  value,
  variant = 'primary',
  isValidating = false,
  icon,
}: FinanceCardProps) {
  let cardClasses = ''
  let titleClasses = ''
  let valueClasses = ''

  switch (variant) {
    case 'primary':
      cardClasses = 'bg-gray-900'
      titleClasses = 'text-beige-100'
      valueClasses = 'text-beige-100'
      break
    case 'secondary':
      cardClasses = 'bg-white'
      titleClasses = 'text-gray-500'
      valueClasses = 'text-gray-900'
      break
    case 'tertiary':
      cardClasses = 'bg-beige-100'
      titleClasses = 'text-gray-500'
      valueClasses = 'text-gray-900'
      break
    default:
      cardClasses = 'bg-gray-900'
      titleClasses = 'text-beige-100'
      valueClasses = 'text-beige-100'
  }

  return isValidating ? (
    <SkeletonFinanceCard />
  ) : (
    <>
      <div
        className={`flex items-center gap-2 h-full w-full p-4 rounded-lg md:h-32 lg:h-[7.4rem] ${cardClasses}`}
      >
        {icon && <div className="mr-4">{icon}</div>}
        <div className="flex flex-col">
          <p className={`text-sm ${titleClasses}`}>{title}</p>
          <h2 className={`text-2xl font-semibold ${valueClasses}`}>{value}</h2>
        </div>
      </div>
    </>
  )
}
