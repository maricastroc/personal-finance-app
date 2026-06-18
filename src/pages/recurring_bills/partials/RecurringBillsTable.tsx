import * as Dialog from "@radix-ui/react-dialog";
import { RecurringBillProps } from "@/types/recurring-bills";
import { formatToDollar } from "@/utils/formatToDollar";
import { RecurringBillCard } from "./RecurringBillCard";
import { SkeletonSection } from "./SkeletonSection";
import { format } from "date-fns";
import { useState } from "react";
import { api } from "@/lib/axios";
import toast from "react-hot-toast";
import { handleApiError } from "@/utils/handleApiError";
import { WarningSection } from "@/components/shared/WarningSection";
import { useBalance } from "@/contexts/BalanceContext";
import { ActionsSection } from "./ActionsSection";
import { DeleteModal } from "@/components/shared/DeleteModal";
import { EditBillModal } from "./EditBillModal";
import { toZonedTime } from "date-fns-tz";
import { PrimaryButton } from "@/components/core/PrimaryButton";

export const RecurringBillsTable = ({
  recurringBills,
  isValidating,
  onSave,
}: {
  recurringBills: RecurringBillProps[] | undefined;
  isValidating: boolean;
  onSave: () => Promise<void>;
}) => {
  const [payingBillId, setPayingBillId] = useState<string | null>(null);

  const [editingBill, setEditingBill] = useState<RecurringBillProps | null>(
    null
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [deletingBill, setDeletingBill] = useState<RecurringBillProps | null>(
    null
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { refetchBalance } = useBalance();

  const handlePayNow = async (bill: RecurringBillProps) => {
    if (payingBillId) return;

    setPayingBillId(bill.id);

    try {
      setIsSubmitting(true);

      const response = await api.post(`/recurring_bills/${bill.id}/pay`, {
        paymentDate: new Date().toISOString().split("T")[0],
      });

      toast.success(response.data.message || "Bill paid successfully!");

      await onSave();
      await refetchBalance();
    } catch (error) {
      handleApiError(error);
    } finally {
      setPayingBillId(null);
      setIsSubmitting(false);
    }
  };

  const shouldShowEnabledButton = (bill: RecurringBillProps) => {
    return bill.status === "due soon" || bill.status === "overdue";
  };

  const hasUpcomingBills = recurringBills?.some(
    (bill) => bill.status === "upcoming"
  );

  const handleEdit = (bill: RecurringBillProps) => {
    setEditingBill(bill);
    setIsEditModalOpen(true);
  };

  const handleDelete = (bill: RecurringBillProps) => {
    setDeletingBill(bill);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteBill = async () => {
    try {
      setIsSubmitting(true);
      const response = await api.delete(`/recurring_bills/${deletingBill?.id}`);

      toast.success(response.data.message);

      await onSave();
      setIsDeleteModalOpen(false);
      setDeletingBill(null);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <table className={`w-full overflow-x-auto`}>
        <thead>
          <tr className="border-b border-surface-600">
            <th
              scope="col"
              className="px-4 pb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-400 text-left w-2/5"
            >
              Recipient Name
            </th>
            <th
              scope="col"
              className="px-4 pb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-400 text-left w-1/5"
            >
              Due Date
            </th>
            <th
              scope="col"
              className="px-4 pb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-400 text-left"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-4 pb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-400 text-right w-1/5"
            >
              Amount
            </th>
            <th
              scope="col"
              className="px-4 pb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-400 text-center"
            >
              Payment
            </th>
            <th
              scope="col"
              className="px-4 pb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-400 text-center"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {isValidating || isSubmitting ? (
            <SkeletonSection />
          ) : recurringBills && recurringBills.length > 0 ? (
            recurringBills.map((bill) => (
              <tr
                key={bill.id}
                className="border-b border-surface-600 hover:bg-surface-700/50 transition-colors"
              >
                <td className="px-4 py-3.5 text-left">
                  <RecurringBillCard
                    name={bill.contactName}
                    avatarUrl={bill.contactAvatar}
                  />
                </td>

                <td className="text-xs text-ink-300 px-4 py-3.5 text-left">
                  {format(
                    toZonedTime(bill.nextDueDate as Date, "UTC"),
                    "MMM dd, yyyy"
                  )}
                </td>

                <td className="px-4 py-3.5 text-left">
                  <span className="text-xs capitalize text-ink-400">
                    {bill.status}
                  </span>
                </td>

                <td className="text-sm text-ink-300 px-4 py-3.5 text-right">
                  <span
                    className={`font-bold ${
                      bill.status === "due soon" || bill.status === "overdue"
                        ? "text-accent-red"
                        : "text-ink-100"
                    }`}
                  >
                    {formatToDollar(bill.amount)}
                  </span>
                </td>

                <td className="px-4 py-3.5 text-center">
                  <PrimaryButton
                    type="button"
                    variant="small"
                    onClick={() => handlePayNow(bill)}
                    disabled={!shouldShowEnabledButton(bill)}
                    isSubmitting={payingBillId === bill.id}
                    className="text-xs font-semibold min-w-16"
                  >
                    Pay
                  </PrimaryButton>
                </td>

                <td>
                  <ActionsSection
                    bill={bill}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="text-sm text-ink-300 rounded-md bg-surface-700 px-4 py-3.5"
              >
                No bills found.
              </td>
            </tr>
          )}

          {hasUpcomingBills && (
            <td colSpan={6}>
              <WarningSection
                title="Note about upcoming bills:"
                description='The "Pay Now" button will become available when bills are due
                    within 3 days (marked as "due soon") or when they are overdue.
                    Upcoming bills cannot be paid in advance through this system.'
              />
            </td>
          )}
        </tbody>
      </table>

      <Dialog.Root open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DeleteModal
          id="delete-bill"
          title={deletingBill?.contactName || ""}
          description="This will permanently delete this recurring bill and all its future scheduled occurrences. This action cannot be undone."
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={handleDeleteBill}
          isSubmitting={isSubmitting}
        />
      </Dialog.Root>

      <Dialog.Root open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <EditBillModal
          bill={editingBill}
          onClose={() => setIsEditModalOpen(false)}
          onSubmitForm={async () => {
            setIsEditModalOpen(false);
            setEditingBill(null);
            await onSave();
          }}
        />
      </Dialog.Root>
    </div>
  );
};
