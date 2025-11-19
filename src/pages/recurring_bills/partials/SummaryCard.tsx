import { RecurringBillsResult } from "@/pages/home";
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
      <h2 id="summary-title" className="text-base font-bold text-gray-900 mb-4">
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
            {/* Paid Bills */}
            <div className="flex items-center justify-between w-full">
              <p className="text-xs text-gray-500">Paid Bills</p>
              <p className="font-bold text-gray-900 text-xs">
                {`${recurringBills?.paid.bills.length} (${formatToDollar(
                  recurringBills?.paid.total || 0
                )})`}
              </p>
            </div>

            <span
              role="separator"
              aria-hidden="true"
              className="bg-gray-200 w-full h-[0.05rem] my-3"
            />

            {/* Total Upcoming */}
            <div className="flex items-center justify-between w-full">
              <p className="text-xs text-gray-500">Total Upcoming</p>
              <p className="font-bold text-gray-900 text-xs">
                {`${recurringBills?.upcoming.bills.length} (${formatToDollar(
                  recurringBills?.upcoming.total || 0
                )})`}
              </p>
            </div>

            <span
              role="separator"
              aria-hidden="true"
              className="bg-gray-200 w-full h-[0.05rem] my-3"
            />

            {/* Due Soon */}
            <div className="flex items-center justify-between w-full">
              <p className="text-xs text-secondary-red">Due Soon</p>
              <p className="font-bold text-secondary-red text-xs">
                {`${recurringBills?.dueSoon.bills.length} (${formatToDollar(
                  recurringBills?.dueSoon.total || 0
                )})`}
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
