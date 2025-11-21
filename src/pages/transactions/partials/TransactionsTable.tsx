import { EmptyContent } from "@/components/shared/EmptyContent";
import { formatToDollar } from "@/utils/formatToDollar";
import { format } from "date-fns";
import { TransactionCard } from "./TransactionCard";
import { SkeletonTransactionCard } from "@/components/shared/SkeletonTransactionCard";
import { TransactionProps } from "@/types/transaction";

export const TransactionTable = ({
  transactions,
  isValidating,
}: {
  transactions: TransactionProps[];
  isValidating: boolean;
}) => (
  <section
    aria-labelledby="transaction-table-title"
    className="hidden md:flex overflow-x-auto mt-6"
  >
    <table className="min-w-full table-fixed">
      <caption id="transaction-table-title" className="sr-only">
        List of financial transactions
      </caption>

      <thead>
        <tr>
          <th
            scope="col"
            className="px-4 py-2 text-xs text-gray-600 text-left w-2/5"
          >
            Recipient Name
          </th>
          <th
            scope="col"
            className="px-4 py-2 text-xs text-gray-600 text-left w-1/5"
          >
            Category
          </th>
          <th
            scope="col"
            className="px-4 py-2 text-xs text-gray-600 text-left w-1/5"
          >
            Transaction Date
          </th>
          <th
            scope="col"
            className="px-4 py-2 text-xs text-gray-600 text-right w-1/5"
          >
            Amount
          </th>
        </tr>
      </thead>

      <tbody>
        {isValidating ? (
          Array.from({ length: 9 }).map((_, index) => (
            <tr key={index} className="border-t">
              <td colSpan={4} className="px-4 py-2">
                <div aria-hidden="true">
                  <SkeletonTransactionCard />
                </div>
              </td>
            </tr>
          ))
        ) : transactions && transactions.length > 0 ? (
          transactions.map((transaction) => {
            const name = transaction?.contactName;

            return (
              <tr key={transaction.id} className="border-t">
                <td className="px-4 py-2 text-left align-top">
                  <TransactionCard
                    name={name}
                    balance={transaction.balance}
                    avatarUrl={transaction?.contactAvatar}
                    date={format(transaction.date, "MMM dd, yyyy")}
                    value={formatToDollar(transaction.amount || 0)}
                    category={transaction.category?.name}
                  />
                </td>

                <td className="text-xs text-gray-600 px-4 py-2 text-left align-middle">
                  {transaction.category?.name}
                </td>

                <td className="text-xs text-gray-600 px-4 py-2 text-left align-middle">
                  <time dateTime={new Date(transaction.date).toISOString()}>
                    {format(transaction.date, "MMM dd, yyyy")}
                  </time>
                </td>

                <td className="text-xs text-gray-600 px-4 py-2 text-right align-middle">
                  <span
                    aria-label={
                      transaction.balance === "income"
                        ? `Income of ${formatToDollar(transaction.amount)}`
                        : `Expense of ${formatToDollar(transaction.amount)}`
                    }
                    className={`font-bold ${
                      transaction.balance === "income"
                        ? "text-secondary-green"
                        : "text-gray-900"
                    }`}
                  >
                    {formatToDollar(transaction.amount)}
                  </span>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={4} className="px-4 py-2">
              <EmptyContent content="No transactions available." />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </section>
);
