import { AVATAR_URL_DEFAULT } from '@/utils/constants'

interface RecurringBillProps {
  name: string
  avatarUrl: string | undefined | null
}

export function RecurringBillCard({ avatarUrl, name }: RecurringBillProps) {
  return (
    <div
      className={`flex justify-between items-center border-b border-b-beige-100 py-4`}
    >
      <div className={`flex items-center gap-3 max-sm:gap-0`}>
        <span
          className={`relative w-11 h-11 rounded-full max-sm:w-9 max-sm:h-9 md:w-11 md:h-11`}
        >
          <img
            src={avatarUrl || AVATAR_URL_DEFAULT}
            alt=""
            className="rounded-full"
          />
        </span>
        <p
          className={`text-gray-900 font-bold overflow-hidden text-xs max-sm:truncate max-sm:whitespace-nowrap max-sm:max-w-[5rem] md:text-sm md:max-w-[12rem]`}
        >
          {name}
        </p>
      </div>
    </div>
  )
}
