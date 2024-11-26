import { formatToDollar } from '@/utils/formatToDollar'

interface FinanceItemProps {
  title: string
  value: number
  color: string
}

export function FinanceItem({ title, value, color }: FinanceItemProps) {
  return (
    <div className="flex items-center w-full">
      <span
        className={`h-14 w-1 rounded-md mr-3`}
        style={{ backgroundColor: `${color}` }}
      />
      <div className="flex flex-col gap-4">
        <p className="text-gray-500 text-xs">{title}</p>
        <h2 className="text-sm font-bold text-gray-900">
          {formatToDollar(value || 0)}
        </h2>
      </div>
    </div>
  )
}
