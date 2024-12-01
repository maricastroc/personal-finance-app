import { RecurringBillsResult } from '@/pages/home'
import { formatToDollar } from '@/utils/formatToDollar'
import useRequest from '@/utils/useRequest'
import { Skeleton } from '@mui/material'

export const SummaryCard = () => {
  const { data: recurringBills, isValidating } =
    useRequest<RecurringBillsResult>({
      url: `/recurring_bills/resume`,
      method: 'GET',
    })

  return (
    <div className="rounded-xl flex bg-white p-6 text-start flex-col">
      <h2 className="text-base font-bold text-gray-900 mb-4">Summary</h2>
      <div className="flex flex-col">
        {isValidating ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                width={'100%'}
                height={20}
              />
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between w-full">
              <p className="text-xs text-gray-500">Paid Bills</p>
              <p className="font-bold text-gray-900 text-xs">{`${
                recurringBills?.paid.bills.length
              } (${formatToDollar(recurringBills?.paid.total || 0)})`}</p>
            </div>
            <span className="bg-gray-200 text-gray-400 w-full h-[0.05rem] my-3" />
            <div className="flex items-center justify-between w-full">
              <p className="text-xs text-gray-500">Total Upcoming</p>
              <p className="font-bold text-gray-900 text-xs">{`${
                recurringBills?.upcoming.bills.length
              } (${formatToDollar(recurringBills?.upcoming.total || 0)})`}</p>
            </div>
            <span className="bg-gray-200 text-gray-400 w-full h-[0.05rem] my-3" />
            <div className="flex items-center justify-between w-full">
              <p className="text-xs text-secondary-red">Due Soon</p>
              <p className="font-bold text-secondary-red text-xs">{`${
                recurringBills?.dueSoon.bills.length
              } (${formatToDollar(recurringBills?.dueSoon.total || 0)})`}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
