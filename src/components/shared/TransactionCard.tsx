import { AVATAR_URL_DEFAULT } from '@/utils/constants'

interface TransactionCardProps {
  name: string
  avatarUrl: string | undefined | null
  date: string
  value: string
  balance: 'expense' | 'income' | undefined
  category?: string
  isBudgetsScreen?: boolean
}

export function TransactionCard({
  avatarUrl,
  name,
  date,
  value,
  balance,
  category,
  isBudgetsScreen = false,
}: TransactionCardProps) {
  return (
    <div
      className={`flex justify-between items-center border-b border-b-beige-100 py-4 ${
        isBudgetsScreen ? 'py-0' : ''
      }`}
    >
      <div
        className={`flex items-center gap-3 ${
          isBudgetsScreen ? 'max-sm:gap-0' : ''
        }`}
      >
        <span
          className={`relative w-11 h-11 rounded-full ${
            isBudgetsScreen ? 'max-sm:w-9 max-sm:h-9 md:w-11 md:h-11' : ''
          }`}
        >
          <img
            src={avatarUrl || AVATAR_URL_DEFAULT}
            alt=""
            className="rounded-full"
          />
        </span>

        <div
          className={`flex flex-col gap-1 items-start text-start overflow-hidden max-sm:pl-2 sm:pl-0`}
        >
          <p
            className={`text-gray-900 font-bold text-sm ${
              isBudgetsScreen
                ? 'overflow-hidden text-xs max-sm:truncate max-sm:whitespace-nowrap max-sm:max-w-[5rem] md:text-sm md:max-w-[12rem]'
                : ''
            }`}
          >
            {name}
          </p>
          {category && <p className="text-gray-500 text-xs">{category}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1 items-end pl-2 text-end">
        <p
          className={`font-bold text-sm ${
            balance === 'income' ? 'text-secondary-green' : 'text-gray-900'
          } ${isBudgetsScreen ? 'text-xs' : ''}`}
        >
          {balance === 'income' ? '+' : '-'} {value}
        </p>
        <p className="text-gray-500 text-xs">{date}</p>
      </div>
    </div>
  )
}
