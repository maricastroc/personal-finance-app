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
  console.log(transactions);
  return (
    <section
      aria-labelledby="transaction-table-title"
      className="flex overflow-x-auto mt-6"
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
                      {format(
                        toZonedTime(transaction.date, "UTC"),
                        "MMM dd, yyyy"
                      )}
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
                colSpan={5}
                className="text-sm text-grey-500 rounded-md bg-beige-100 px-4 py-2"
              >
                No transactions found.
              </td>
            </tr>
          )}

          <tr>
            <td colSpan={5}>
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
