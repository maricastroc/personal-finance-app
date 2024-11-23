import Image, { StaticImageData } from 'next/image'

interface TransactionCardProps {
  name: string
  avatarUrl: StaticImageData
  date: string
  value: string
  balance: 'positive' | 'negative'
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
          <Image src={avatarUrl} alt="" className="rounded-full" />
        </span>
        <p className="text-gray-900 font-bold text-sm">{name}</p>
      </div>

      <div className="flex flex-col gap-3 items-end pl-2 text-end">
        <p
          className={`font-bold text-sm ${
            balance === 'positive' ? 'text-secondary-green' : 'text-gray-900'
          }`}
        >
          {balance === 'positive' ? '+' : '-'} {value}
        </p>
        <p className="text-gray-500 text-xs">{date}</p>
      </div>
    </div>
  )
}
