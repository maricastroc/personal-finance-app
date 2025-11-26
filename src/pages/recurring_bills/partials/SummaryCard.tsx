import { RecurringBillsResult } from "@/types/recurring-bills-result";
import { formatToDollar } from "@/utils/formatToDollar";
import { Skeleton } from "@mui/material";

interface SummaryCardProps {
  recurringBills: RecurringBillsResult | undefined;
  isValidating: boolean;
}

export const SummaryCard = ({
  recurringBills,
  isValidating,
}: SummaryCardProps) => {
  return (
    <section
      aria-labelledby="summary-title"
      className="rounded-xl flex bg-white p-6 text-start flex-col"
    >
      <h2 id="summary-title" className="text-base font-bold text-grey-900 mb-4">
        Summary
      </h2>

      <div className="flex flex-col">
        {isValidating ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                width="100%"
                height={20}
              />
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between w-full">
              <p className="text-xs text-grey-500">Total Upcoming</p>
              <p className="font-bold text-grey-900 text-xs">
                {`${
                  recurringBills?.upcoming.bills.length || 0
                } (${formatToDollar(recurringBills?.upcoming.total || 0)})`}
              </p>
            </div>

            <span
              role="separator"
              aria-hidden="true"
              className="bg-grey-300 w-full h-[0.05rem] my-3"
            />

            <div className="flex items-center justify-between w-full">
              <p className="text-xs text-grey-500">Total Due Soon</p>
              <p className="font-bold text-grey-900 text-xs">
                {`${
                  recurringBills?.dueSoon.bills.length || 0
                } (${formatToDollar(recurringBills?.dueSoon.total || 0)})`}
              </p>
            </div>

            <span
              role="separator"
              aria-hidden="true"
              className="bg-grey-300 w-full h-[0.05rem] my-3"
            />

            <div className="flex items-center justify-between w-full">
              <p className="text-xs text-secondary-red">Total Overdue</p>
              <p className="font-bold text-secondary-red text-xs">
                {`${
                  recurringBills?.overdue.bills.length || 0
                } (${formatToDollar(recurringBills?.overdue.total || 0)})`}
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
