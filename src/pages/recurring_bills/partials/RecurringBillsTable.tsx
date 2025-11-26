import * as Dialog from "@radix-ui/react-dialog";
import { RecurringBillProps } from "@/types/recurring-bills";
import { formatToDollar } from "@/utils/formatToDollar";
import { RecurringBillCard } from "./RecurringBillCard";
import iconBillPaid from "/public/assets/images/icon-bill-paid.svg";
import iconBillDueSoon from "/public/assets/images/icon-bill-due.svg";
import iconBillOverdue from "/public/assets/images/icon-bill-overdue.svg";
import Image from "next/image";
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
      <table
        className={`table-fixed overflow-x-auto ${
          recurringBills && recurringBills?.length > 0
            ? "min-w-[40rem]"
            : "min-w-[35rem]"
        }`}
      >
        <thead>
          <tr>
            <th className="px-4 py-2 text-xs text-grey-500 text-left w-2/5">
              Recipient Name
            </th>
            <th className="px-4 py-2 text-xs text-grey-500 text-left w-1/5">
              Due Date
            </th>
            <th className="px-4 py-2 text-xs text-grey-500 text-left w-1/7">
              Status
            </th>
            <th className="px-4 py-2 text-xs text-grey-500 text-right w-1/5">
              Amount
            </th>
            <th className="px-4 py-2 text-xs text-grey-500 text-center w-3/5">
              Payment
            </th>
            <th className="px-4 py-2 text-xs text-grey-500 text-center w-3/5">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {isValidating || isSubmitting ? (
            <SkeletonSection />
          ) : recurringBills && recurringBills.length > 0 ? (
            recurringBills.map((bill) => (
              <tr key={bill.id} className="border-t">
                <td className="px-4 py-2 text-left">
                  <RecurringBillCard
                    name={bill.contactName}
                    avatarUrl={bill.contactAvatar}
                  />
                </td>

                <td className="text-xs text-grey-500 px-4 py-2 text-left">
                  {format(
                    toZonedTime(bill.nextDueDate as Date, "UTC"),
                    "MMM dd, yyyy"
                  )}
                </td>

                <td className="text-xs text-grey-500 px-4 py-2 text-left">
                  <div className="flex items-center gap-1 capitalize">
                    {bill.status === "upcoming" && (
                      <Image src={iconBillPaid} alt="Upcoming" width={12} />
                    )}

                    {bill.status === "due soon" && (
                      <Image src={iconBillDueSoon} alt="Due soon" width={12} />
                    )}

                    {bill.status === "overdue" && (
                      <Image src={iconBillOverdue} alt="Overdue" width={12} />
                    )}

                    {bill.status}
                  </div>
                </td>

                <td className="text-sm text-grey-500 px-4 py-2 text-right">
                  <span
                    className={`font-bold ${
                      bill.status === "due soon" || bill.status === "overdue"
                        ? "text-secondary-red"
                        : "text-grey-900"
                    }`}
                  >
                    {formatToDollar(bill.amount)}
                  </span>
                </td>

                <td className="px-4 py-2 text-center">
                  <button
                    type="button"
                    onClick={() => handlePayNow(bill)}
                    disabled={!shouldShowEnabledButton(bill)}
                    className={`
                      p-2 py-1 text-xs font-medium rounded-md transition-colors
                      disabled:cursor-not-allowed disabled:border-grey-300 border text-white bg-secondary-green hover:text-white hover:bg-secondary-greenHover disabled:bg-grey-300 disabled:text-white
                    `}
                  >
                    {payingBillId === bill.id ? "Paying..." : "Pay Now"}
                  </button>
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
              <td colSpan={6} className="px-4 py-2">
                <span className="text-secondary-red w-full text-sm font-bold">
                  No recurring bills found.
                </span>
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
