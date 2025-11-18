import { SkeletonTransactionCard } from '@/components/shared/SkeletonTransactionCard'
import { TransactionCard } from '@/components/shared/TransactionCard'
import { TransactionProps } from '@/types/transaction'
import { formatToDollar } from '@/utils/formatToDollar'
import { format } from 'date-fns'

interface BudgetCardTransactionsProps {
  transactions: TransactionProps[]
  isLoading: boolean
  onSeeAll: () => void
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
          className="flex items-center gap-2 hover:opacity-80"
          type="button"
        >
          <p className="text-sm text-gray-500">See All</p>
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
            <div key={i} aria-hidden="true">
              <SkeletonTransactionCard />
            </div>
          ))}
        </div>
      ) : (
        <ul className="flex flex-col mt-6">
          {transactions.map((t, i) => (
            <li key={t.id || i}>
              <TransactionCard
                isBudgetsScreen
                name={t.balance === 'income' ? t.sender.name : t.recipient.name}
                balance={t.balance}
                avatarUrl={
                  t.balance === 'income'
                    ? t.sender.avatarUrl
                    : t.recipient.avatarUrl
                }
                date={format(t.date, 'MMM dd, yyyy')}
                value={formatToDollar(t.amount)}
              />

              {i !== transactions.length - 1 && (
                <span
                  aria-hidden="true"
                  className="w-full h-px bg-gray-200 my-1"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
