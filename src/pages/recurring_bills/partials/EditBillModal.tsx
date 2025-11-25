/* eslint-disable react-hooks/exhaustive-deps */
import { PrimaryButton } from "@/components/core/PrimaryButton";
import { CurrencyInput } from "@/components/core/CurrencyInput";
import { api } from "@/lib/axios";
import { handleApiError } from "@/utils/handleApiError";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { Modal } from "@/components/shared/Modal";
import { formatToDollar } from "@/utils/formatToDollar";
import { RecurringBillProps } from "@/types/recurringBills";
import { WarningSection } from "@/components/shared/WarningSection";
import { TRANSFER_CONSTRAINTS } from "@/utils/constants";

const editBillSchema = () =>
  z.object({
    amount: z
      .number({ invalid_type_error: "Amount must be a number." })
      .min(1, { message: "Amount must be greater than zero." })
      .max(TRANSFER_CONSTRAINTS.MAX_LIMIT, {
        message: `Target amount cannot exceed ${formatToDollar(
          TRANSFER_CONSTRAINTS.MAX_LIMIT
        )}`,
      }),
  });

export type EditBillFormData = z.infer<ReturnType<typeof editBillSchema>>;

interface EditBillModalProps {
  onClose: () => void;
  onSubmitForm: () => Promise<void>;
  bill: RecurringBillProps | null;
}

export function EditBillModal({
  onClose,
  onSubmitForm,
  bill,
}: EditBillModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<EditBillFormData>({
    resolver: zodResolver(editBillSchema()),
    defaultValues: {
      amount: Math.abs(bill?.amount || 0),
    },
  });

  const handleEditBill = async (data: EditBillFormData) => {
    try {
      setIsSubmitting(true);

      const payload = {
        amount: Math.abs(data.amount),
      };

      const response = await api.put(`/recurring_bills/${bill?.id}`, payload);

      toast.success(response.data.message || "Bill updated successfully!");
      await onSubmitForm();
      onClose();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalTitle = `Edit ${bill?.contactName}`;
  const modalDescription = `Update the amount for this recurring bill. This will affect all future occurrences.`;

  return (
    bill && (
      <Modal
        id="editing-bill"
        title={modalTitle}
        description={modalDescription}
        onClose={onClose}
      >
        <form onSubmit={handleSubmit(handleEditBill)} className="mt-6">
          <div className="bg-beige-100 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-grey-500">Current Amount</p>
                <p className="font-semibold text-grey-900">
                  {formatToDollar(Math.abs(bill.amount))}
                </p>
              </div>
              <div>
                <p className="text-grey-500">Next Due Date</p>
                <p className="font-semibold text-grey-900">
                  {new Date(bill?.nextDueDate as Date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-grey-500">Recurrence</p>
                <p className="font-semibold text-grey-900">Monthly</p>
              </div>
              <div>
                <p className="text-grey-500">Due Day</p>
                <p className="font-semibold text-grey-900">
                  {bill.recurrenceDay}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <Controller
              name="amount"
              control={control}
              render={({ field, fieldState }) => (
                <CurrencyInput
                  label="New Amount ($)"
                  value={field.value}
                  onValueChange={field.onChange}
                  id="amount"
                  placeholder="$0.00"
                  error={fieldState.error?.message}
                  autoFocus
                />
              )}
            />
          </div>

          <WarningSection title="This change will apply to all future occurrences of this bill." />

          <PrimaryButton
            className="mt-6"
            type="submit"
            isSubmitting={isSubmitting}
          >
            Update Bill
          </PrimaryButton>
        </form>
      </Modal>
    )
  );
}
