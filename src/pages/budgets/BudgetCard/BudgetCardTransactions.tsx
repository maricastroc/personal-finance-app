import { SkeletonTransactionCard } from "@/components/shared/SkeletonTransactionCard";
import { TransactionCard } from "@/components/shared/TransactionCard";
import { TransactionProps } from "@/types/transaction";
import { formatToDollar } from "@/utils/formatToDollar";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

interface BudgetCardTransactionsProps {
  transactions: TransactionProps[];
  isLoading: boolean;
  onSeeAll: () => void;
}

export function BudgetCardTransactions({
  transactions,
  isLoading,
  onSeeAll,
}: BudgetCardTransactionsProps) {
  return (
    <section
      aria-labelledby="latest-spending-title"
      className="mt-6 bg-beige-100 p-4 rounded-lg md:p-6"
    >
      <div className="flex items-center justify-between">
        <h2 id="latest-spending-title" className="font-bold text-base">
          Latest Spending
        </h2>

        <button
          onClick={onSeeAll}
          aria-label="See all transactions"
          type="button"
          className="flex items-center gap-2 hover:opacity-80"
        >
          <span className="text-sm text-grey-500">See All</span>
          <img
            src="/assets/images/icon-caret-right.svg"
            alt=""
            role="presentation"
            className="h-3 w-3"
          />
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col mt-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonTransactionCard key={i} aria-hidden="true" />
          ))}
        </div>
      ) : !transactions.length ? (
        <p className="mt-6 text-sm text-grey-500 text-center">
          No transactions found
        </p>
      ) : (
        <ul className="flex flex-col mt-6">
          {transactions.map((transaction, index) => (
            <li key={transaction.id ?? index}>
              <TransactionCard
                isBudgetsScreen
                name={transaction.contactName}
                balance={transaction.balance}
                avatarUrl={transaction.contactAvatar}
                date={format(
                  toZonedTime(transaction.date, "UTC"),
                  "MMM dd, yyyy"
                )}
                value={formatToDollar(transaction.amount)}
              />

              {index < transactions.length - 1 && (
                <span
                  aria-hidden="true"
                  className="w-full h-px bg-grey-300 my-1"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
