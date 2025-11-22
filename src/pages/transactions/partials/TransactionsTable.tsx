/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmptyContent } from "@/components/shared/EmptyContent";
import { formatToDollar } from "@/utils/formatToDollar";
import { format } from "date-fns";
import { TransactionCard } from "./TransactionCard";
import { SkeletonTransactionCard } from "@/components/shared/SkeletonTransactionCard";
import { TransactionProps } from "@/types/transaction";
import { CategoryProps } from "@/types/category";
import { KeyedMutator } from "swr";
import { AxiosResponse } from "axios";
import { ActionsSection } from "./ActionsSection";

interface TransactionTableProps {
  transactions: TransactionProps[];
  isValidating: boolean;
  isEditModalOpen: boolean;
  categories: CategoryProps[] | undefined;
  setIsEditModalOpen: (value: boolean) => void;
  onEdit?: (transaction: TransactionProps) => void;
  onDelete?: (transaction: TransactionProps) => void;
  mutate: KeyedMutator<AxiosResponse<TransactionProps[] | any>>;
}

export const TransactionTable = ({
  transactions,
  isValidating,
  isEditModalOpen,
  categories,
  mutate,
  setIsEditModalOpen,
  onEdit,
  onDelete,
}: TransactionTableProps) => (
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
            className="px-4 py-2 text-xs text-grey-500 text-left w-2/5"
          >
            Recipient Name
          </th>
          <th
            scope="col"
            className="px-4 py-2 text-xs text-grey-500 text-left w-1/5"
          >
            Category
          </th>
          <th
            scope="col"
            className="px-4 py-2 text-xs text-grey-500 text-left w-1/5"
          >
            Transaction Date
          </th>
          <th
            scope="col"
            className="px-4 py-2 text-xs text-grey-500 text-right w-1/5"
          >
            Amount
          </th>
          <th
            scope="col"
            className="px-4 py-2 text-xs text-grey-500 text-center w-20"
          >
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        {isValidating ? (
          Array.from({ length: 9 }).map((_, index) => (
            <tr key={index} className="border-t">
              <td colSpan={5} className="px-4 py-2">
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
              <tr
                key={transaction.id}
                className="border-t hover:bg-white transition-colors"
              >
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

                <td className="text-xs text-grey-500 px-4 py-2 text-left align-middle">
                  {transaction.category?.name}
                </td>

                <td className="text-xs text-grey-500 px-4 py-2 text-left align-middle">
                  <time dateTime={new Date(transaction.date).toISOString()}>
                    {format(transaction.date, "MMM dd, yyyy")}
                  </time>
                </td>

                <td className="text-xs text-grey-500 px-4 py-2 text-right align-middle">
                  <span
                    aria-label={
                      transaction.balance === "income"
                        ? `Income of ${formatToDollar(transaction.amount)}`
                        : `Expense of ${formatToDollar(transaction.amount)}`
                    }
                    className={`font-bold ${
                      transaction.balance === "income"
                        ? "text-secondary-green"
                        : "text-secondary-red"
                    }`}
                  >
                    {formatToDollar(transaction.amount)}
                  </span>
                </td>

                <ActionsSection
                  mutate={mutate}
                  categories={categories}
                  setIsEditModalOpen={setIsEditModalOpen}
                  isEditModalOpen={isEditModalOpen}
                  transaction={transaction}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={5} className="px-4 py-2">
              <EmptyContent content="No transactions available." />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </section>
);
