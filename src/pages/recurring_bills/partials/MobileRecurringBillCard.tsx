import { AVATAR_URL_DEFAULT } from '@/utils/constants'
import { formatToDollar } from '@/utils/formatToDollar'
import { getOrdinalSuffix } from '@/utils/getOrdinalSuffix'
import iconBillPaid from '/public/assets/images/icon-bill-paid.svg'
import iconBillDue from '/public/assets/images/icon-bill-due.svg'
import Image from 'next/image'

interface RecurringBillProps {
  name: string
  avatarUrl: string | undefined | null
  recurrenceFrequency: string
  recurrenceDay: string
  amount: number
  status: string
}

export function MobileRecurringBillCard({
  avatarUrl,
  name,
  recurrenceDay,
  amount,
  status,
  recurrenceFrequency,
}: RecurringBillProps) {
  return (
    <article
      role="group"
      aria-label={`Recurring bill for ${name}`}
      className="flex justify-between items-center border-b border-b-beige-100 py-4"
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <span className="relative w-[2rem] h-[2rem] rounded-full max-sm:w-9 max-sm:h-9 md:w-11 md:h-11">
            <img
              src={avatarUrl || AVATAR_URL_DEFAULT}
              alt={`${name} logo`}
              className="rounded-full"
            />
          </span>

          <p className="text-gray-900 font-bold overflow-hidden text-sm max-sm:truncate max-sm:whitespace-nowrap max-sm:max-w-[40vw] md:text-sm md:max-w-[12rem]">
            {name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <time
            dateTime={`${recurrenceFrequency} ${recurrenceDay}`}
            className="text-xs text-gray-600 py-2 text-left"
          >
            {`${recurrenceFrequency} - ${getOrdinalSuffix(
              recurrenceDay || '',
            )}`}
          </time>

          {status === 'paid' && (
            <Image src={iconBillPaid} alt="Bill paid" width={12} />
          )}

          {status === 'due soon' && (
            <Image src={iconBillDue} alt="Bill due soon" width={12} />
          )}
        </div>
      </div>

      <div className="text-sm text-gray-600 px-4 py-2 text-right">
        <span
          className={`font-bold ${
            status === 'due soon' ? 'text-secondary-red' : 'text-gray-900'
          }`}
        >
          {formatToDollar(amount)}
        </span>
      </div>
    </article>
  )
}
