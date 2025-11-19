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
  <div className="hidden md:flex overflow-x-auto mt-6">
    <table className="min-w-full table-fixed">
      <thead>
        <tr>
          <th className="px-4 py-2 text-xs text-gray-600 text-left w-2/5">
            Recipient / Sender
          </th>
          <th className="px-4 py-2 text-xs text-gray-600 text-left w-1/5">
            Category
          </th>
          <th className="px-4 py-2 text-xs text-gray-600 text-left w-1/5">
            Transaction Date
          </th>
          <th className="px-4 py-2 text-xs text-gray-600 text-right w-1/5">
            Amount
          </th>
        </tr>
      </thead>
      <tbody>
        {isValidating ? (
          Array.from({ length: 9 }).map((_, index) => (
            <tr key={index} className="border-t">
              <td colSpan={4} className="px-4 py-2">
                <SkeletonTransactionCard />
              </td>
            </tr>
          ))
        ) : transactions && transactions.length > 0 ? (
          transactions.map((transaction) => (
            <tr key={transaction.id} className="border-t">
              <td className="px-4 py-2 text-left">
                <TransactionCard
                  name={
                    transaction.balance === "income"
                      ? transaction.sender.name
                      : transaction.recipient.name
                  }
                  balance={transaction.balance}
                  avatarUrl={
                    transaction.balance === "income"
                      ? transaction.sender.avatarUrl
                      : transaction.recipient.avatarUrl
                  }
                  date={format(transaction.date, "MMM dd, yyyy")}
                  value={formatToDollar(transaction.amount || 0)}
                  category={transaction.category?.name}
                />
              </td>
              <td className="text-xs text-gray-600 px-4 py-2 text-left">
                {transaction.category?.name}
              </td>
              <td className="text-xs text-gray-600 px-4 py-2 text-left">
                {format(transaction.date, "MMM dd, yyyy")}
              </td>
              <td className="text-xs text-gray-600 px-4 py-2 text-right">
                <span
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
          ))
        ) : (
          <tr>
            <td colSpan={4} className="px-4 py-2">
              <EmptyContent content="No transactions available." />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);
