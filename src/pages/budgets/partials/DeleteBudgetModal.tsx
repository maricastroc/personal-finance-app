import { DeleteButton } from "@/components/core/DeleteButton";
import { PrimaryButton } from "@/components/core/PrimaryButton";
import { api } from "@/lib/axios";
import { BudgetProps } from "@/types/budget";
import { handleApiError } from "@/utils/handleApiError";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "phosphor-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface DeleteBudgetModalProps {
  id: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  onClose: () => void;
  budget: BudgetProps;
  onSubmitForm: () => Promise<void>;
}

export function DeleteBudgetModal({
  id,
  isOpen,
  onOpenChange,
  onClose,
  budget,
  onSubmitForm,
}: DeleteBudgetModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteBudget = async () => {
    try {
      setIsSubmitting(true);
      const response = await api.delete(`/budgets/${budget.id}`);

      toast.success(response.data.message);
      await onSubmitForm();
      onClose();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[990] bg-black bg-opacity-70" />

        <Dialog.Content
          id={id}
          aria-labelledby={`${id}-title`}
          aria-describedby={`${id}-desc`}
          className="fixed z-[999] top-1/2 left-1/2 
            -translate-x-1/2 -translate-y-1/2 
            w-[90vw] md:w-[560px] 
            bg-white rounded-lg shadow-lg p-6 md:p-8"
        >
          <Dialog.Close
            aria-label="Close modal"
            onClick={onClose}
            className="absolute top-4 right-4 hover:bg-grey-900 hover:text-white 
              transition-all duration-300 text-grey-500 
              p-[0.1rem] rounded-full border border-graey-900 
              focus:outline-offset-2"
          >
            <X size={16} />
          </Dialog.Close>

          <Dialog.Title
            id={`${id}-title`}
            className="text-xl font-semibold text-grey-900 mb-2 md:text-2xl"
          >
            Delete “{budget.category.name}”
          </Dialog.Title>

          <Dialog.Description
            id={`${id}-desc`}
            className="flex flex-col w-full text-sm text-grey-500"
          >
            This action cannot be undone. All associated transactions and data
            for this budget will be permanently removed.
          </Dialog.Description>

          <div className="flex flex-col w-full gap-4 mt-10">
            <DeleteButton
              type="button"
              disabled={isSubmitting}
              onClick={handleDeleteBudget}
            >
              Yes, confirm deletion
            </DeleteButton>

            <PrimaryButton
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              variant="secondary"
              className="mt-0 text-sm"
            >
              No, I want to go back
            </PrimaryButton>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
