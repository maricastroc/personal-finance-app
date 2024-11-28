import { formatToDollar } from '@/utils/formatToDollar'
import Image from 'next/image'
import iconRecurringBills from '../../../../public/assets/images/icon-recurring-bills.svg'
import useRequest from '@/utils/useRequest'
import { RecurringBillsResult } from '@/pages/home'

export const TotalBillsCard = () => {
  const { data: recurringBills } = useRequest<RecurringBillsResult>({
    url: `/recurring_bills/resume`,
    method: 'GET',
  })

  return (
    <div className="rounded-xl flex bg-gray-900 p-6 gap-6 md:flex-grow lg:flex-grow-0 md:flex-col md:pt-10 md:justify-between">
      <Image src={iconRecurringBills} alt="" width={32} />
      <div className="flex flex-col gap-1">
        <p className="text-sm text-white">Total Bills</p>
        <h2 className="text-3xl text-white font-bold">{`${formatToDollar(
          recurringBills?.monthlyTotal || 0,
        )}`}</h2>
      </div>
    </div>
  )
}
