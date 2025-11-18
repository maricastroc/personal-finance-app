import { SkeletonTransactionsSection } from '@/components/skeletons/SkeletonTransactionsSection'
import { TransactionProps } from '@/types/transaction'
import HomeCard from './HomeCard'
import { TransactionCard } from '@/components/shared/TransactionCard'
import { formatToDollar } from '@/utils/formatToDollar'
import { EmptyContent } from '@/components/shared/EmptyContent'
import { format } from 'date-fns'

interface TransactionsSectionProps {
  isValidating: boolean
  transactions: TransactionProps[] | undefined
}

export const TransactionsSection = ({
  isValidating,
  transactions,
}: TransactionsSectionProps) => {
  return (
    <HomeCard
      routePath="/transactions"
      title="Transactions"
      buttonLabel="View All"
    >
      {isValidating ? (
        <SkeletonTransactionsSection />
      ) : (
        <div>
          {transactions && transactions?.length ? (
            transactions.map((transaction, index) => (
              <TransactionCard
                key={index}
                name={
                  transaction.balance === 'income'
                    ? transaction.sender.name
                    : transaction.recipient.name
                }
                balance={transaction.balance}
                avatarUrl={
                  transaction.balance === 'income'
                    ? transaction.sender.avatarUrl
                    : transaction.recipient.avatarUrl
                }
                date={format(transaction.date, 'MMM dd, yyyy')}
                value={formatToDollar(transaction.amount || 0)}
              />
            ))
          ) : (
            <EmptyContent content="No transactions available." />
          )}
        </div>
      )}
    </HomeCard>
  )
}
