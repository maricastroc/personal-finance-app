import { formatToDollar } from '@/utils/formatToDollar'

interface FinanceItemProps {
  title: string
  value: number
  color: string
  isBudgetsPage?: boolean
  amountSpent?: number
}

export function FinanceItem({
  title,
  value,
  color,
  amountSpent,
  isBudgetsPage = false,
}: FinanceItemProps) {
  return (
    <div className={`flex items-center w-full`}>
      <span
        className={`w-1 rounded-md mr-3 ${!isBudgetsPage ? 'h-14' : 'h-6'}`}
        style={{ backgroundColor: `${color}` }}
      />
      <div
        className={`flex gap-4 ${!isBudgetsPage && 'flex-col'} ${
          isBudgetsPage && 'w-full justify-between'
        }`}
      >
        <p className="text-gray-500 text-xs">{title}</p>
        <div className="flex items-center">
          <h2 className="text-sm font-bold text-gray-900">
            {formatToDollar(value || 0)}
          </h2>
          {isBudgetsPage && amountSpent && (
            <p className="ml-1 text-xs text-gray-500">
              {' '}
              of {formatToDollar(amountSpent || 0)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
