import { AVATAR_URL_DEFAULT } from '@/utils/constants'

interface TransactionCardProps {
  name: string
  avatarUrl: string | undefined | null
  date: string
  value: string
  balance: 'expense' | 'income' | undefined
}
export function TransactionCard({
  avatarUrl,
  name,
  date,
  value,
  balance,
}: TransactionCardProps) {
  return (
    <div className="flex justify-between items-center border-b border-b-beige-100 py-4">
      <div className="flex items-center gap-3 ">
        <span className="relative w-11 h-11 rounded-full">
          <img
            src={avatarUrl || AVATAR_URL_DEFAULT}
            alt=""
            className="rounded-full"
          />
        </span>
        <p className="text-gray-900 font-bold text-sm">{name}</p>
      </div>

      <div className="flex flex-col gap-3 items-end pl-2 text-end">
        <p
          className={`font-bold text-sm ${
            balance === 'income' ? 'text-secondary-green' : 'text-gray-900'
          }`}
        >
          {balance === 'income' ? '+' : '-'} {value}
        </p>
        <p className="text-gray-500 text-xs">{date}</p>
      </div>
    </div>
  )
}
