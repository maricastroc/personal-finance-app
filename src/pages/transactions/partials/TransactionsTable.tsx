/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Dialog from "@radix-ui/react-dialog";
import { formatToDollar } from "@/utils/formatToDollar";
import { format } from "date-fns";
import { TransactionCard } from "./TransactionCard";
import { SkeletonTransactionCard } from "@/components/shared/SkeletonTransactionCard";
import { TransactionProps } from "@/types/transaction";
import { CategoryProps } from "@/types/category";
import { KeyedMutator } from "swr";
import { AxiosResponse } from "axios";
import { ActionsSection } from "./ActionsSection";
import { useState } from "react";
import { TransferFormModal } from "./TransferFormModal";
import { api } from "@/lib/axios";
import toast from "react-hot-toast";
import { handleApiError } from "@/utils/handleApiError";
import { DeleteModal } from "@/components/shared/DeleteModal";
import { WarningSection } from "@/components/shared/WarningSection";
import { useBalance } from "@/contexts/BalanceContext";
import { toZonedTime } from "date-fns-tz";

interface TransactionTableProps {
  transactions: TransactionProps[];
  isValidating: boolean;
  categories: CategoryProps[] | undefined;
  mutate: KeyedMutator<AxiosResponse<TransactionProps[] | any>>;
}

export const TransactionTable = ({
  transactions,
  isValidating,
  categories,
  mutate,
}: TransactionTableProps) => {
  const [editingTransaction, setEditingTransaction] =
    useState<TransactionProps | null>(null);

  const [deletingTransaction, setDeletingTransaction] =
    useState<TransactionProps | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { refetchBalance } = useBalance();

  const handleEdit = (transaction: TransactionProps) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleDelete = (transaction: TransactionProps) => {
    setDeletingTransaction(transaction);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = async () => {
    try {
      setIsSubmitting(true);
      const response = await api.delete(
        `/transactions/${deletingTransaction?.id}`
      );

      toast.success(response.data.message);

      await mutate();
      await refetchBalance();
      setIsDeleteModalOpen(false);
      setDeletingTransaction(null);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section
      aria-labelledby="transaction-table-title"
      className="flex overflow-x-auto mt-4"
    >
      <table className="min-w-full table-fixed">
        <caption id="transaction-table-title" className="sr-only">
          List of financial transactions
        </caption>

        <thead>
          <tr className="border-b border-surface-600">
            <th
              scope="col"
              className="px-4 pb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-400 text-left w-2/5"
            >
              Recipient
            </th>
            <th
              scope="col"
              className="px-4 pb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-400 text-left w-1/5"
            >
              Category
            </th>
            <th
              scope="col"
              className="px-4 pb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-400 text-left w-1/5"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-4 pb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-400 text-center w-1/6"
            >
              Recurring
            </th>
            <th
              scope="col"
              className="px-4 pb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-400 text-right w-1/5"
            >
              Amount
            </th>
            <th
              scope="col"
              className="px-4 pb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-400 text-center w-20"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {isValidating ? (
            Array.from({ length: 9 }).map((_, index) => (
              <tr key={index} className="border-b border-surface-600">
                <td colSpan={6} className="px-4 py-3">
                  <div aria-hidden="true">
                    <SkeletonTransactionCard />
                  </div>
                </td>
              </tr>
            ))
          ) : transactions && transactions.length > 0 ? (
            transactions.map((transaction) => {
              const name = transaction?.contactName;
              const isIncome = transaction.balance === "income";

              return (
                <tr
                  key={transaction.id}
                  className="border-b border-surface-600 hover:bg-surface-700/50 transition-colors group"
                >
                  <td className="px-4 py-3.5 text-left align-middle">
                    <TransactionCard
                      name={name}
                      balance={transaction.balance}
                      avatarUrl={transaction?.contactAvatar}
                      date={format(transaction.date, "MMM dd, yyyy")}
                      value={formatToDollar(transaction.amount || 0)}
                      category={transaction.category?.name}
                    />
                  </td>

                  <td className="px-4 py-3.5 text-left align-middle">
                    {transaction.category?.name && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide bg-surface-600 text-ink-300">
                        {transaction.category.name}
                      </span>
                    )}
                  </td>

                  <td className="text-xs text-ink-400 px-4 py-3.5 text-left align-middle tabular-nums">
                    <time dateTime={new Date(transaction.date).toISOString()}>
                      {format(
                        toZonedTime(transaction.date, "UTC"),
                        "MMM dd, yyyy"
                      )}
                    </time>
                  </td>

                  <td className="px-4 py-3.5 text-center align-middle">
                    {transaction.isRecurring ||
                    transaction.isRecurringGenerated ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide bg-accent-green/10 text-accent-green">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
                        </svg>
                        Recurring
                      </span>
                    ) : (
                      <span className="text-ink-400 text-[10px]">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 text-right align-middle tabular-nums whitespace-nowrap">
                    <span
                      aria-label={
                        isIncome
                          ? `Income of ${formatToDollar(transaction.amount)}`
                          : `Expense of ${formatToDollar(transaction.amount)}`
                      }
                      className={`text-sm font-semibold ${
                        isIncome ? "text-accent-green" : "text-accent-red"
                      }`}
                    >
                      {isIncome ? "+ " : "– "}
                      {formatToDollar(transaction.amount)}
                    </span>
                  </td>

                  <ActionsSection
                    transaction={transaction}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    isDisabled={
                      !!transaction?.isRecurring ||
                      !!transaction.isRecurringGenerated
                    }
                  />
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={6}
                className="text-sm text-ink-300 px-4 py-8 text-center"
              >
                No transactions found.
              </td>
            </tr>
          )}

          <tr>
            <td colSpan={6}>
              <WarningSection title="All recurring transactions are managed in the Recurring Bills area, which is why the edit and delete buttons are disabled here. Go there to view or pay your scheduled bills." />
            </td>
          </tr>
        </tbody>
      </table>

      <Dialog.Root open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        {categories && editingTransaction && (
          <TransferFormModal
            isEdit
            transaction={editingTransaction}
            id="transfer-form-modal"
            categories={categories}
            onSubmitForm={async (): Promise<void> => {
              await mutate();
            }}
            onClose={handleCloseModal}
          />
        )}
      </Dialog.Root>

      <Dialog.Root open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DeleteModal
          id="delete-transaction"
          title={deletingTransaction?.contactName || ""}
          description="This transaction will be permanently removed from your records. Your balance will be adjusted accordingly. This action cannot be undone."
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={handleDeleteTransaction}
          isSubmitting={isSubmitting}
        />
      </Dialog.Root>
    </section>
  );
};
