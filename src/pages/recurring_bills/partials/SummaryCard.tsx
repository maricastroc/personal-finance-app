import { RecurringBillsResult } from "@/types/recurring-bills-result";
import { formatToDollar } from "@/utils/formatToDollar";

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
      className="rounded-xl flex p-6 text-start flex-col"
      style={{
        background: "var(--card-gradient)",
        border: "1px solid var(--card-border)",
      }}
    >
      <h2
        id="summary-title"
        className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-300 mb-4"
      >
        Summary
      </h2>

      <div className="flex flex-col">
        {isValidating ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="w-full h-5 rounded bg-surface-600 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between w-full">
              <p className="text-xs text-ink-300">Total Upcoming</p>
              <p className="font-semibold text-ink-100 text-xs">
                {`${
                  recurringBills?.upcoming.bills.length || 0
                } (${formatToDollar(recurringBills?.upcoming.total || 0)})`}
              </p>
            </div>

            <span
              role="separator"
              aria-hidden="true"
              className="bg-surface-600 w-full h-px my-3"
            />

            <div className="flex items-center justify-between w-full">
              <p className="text-xs text-ink-300">Total Due Soon</p>
              <p className="font-semibold text-ink-100 text-xs">
                {`${
                  recurringBills?.dueSoon.bills.length || 0
                } (${formatToDollar(recurringBills?.dueSoon.total || 0)})`}
              </p>
            </div>

            <span
              role="separator"
              aria-hidden="true"
              className="bg-surface-600 w-full h-px my-3"
            />

            <div className="flex items-center justify-between w-full">
              <p className="text-xs text-accent-red">Total Overdue</p>
              <p className="font-semibold text-accent-red text-xs">
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
