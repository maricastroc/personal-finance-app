import { DeleteButton } from "@/components/core/DeleteButton";
import { PrimaryButton } from "@/components/core/PrimaryButton";
import { api } from "@/lib/axios";
import { PotProps } from "@/types/pot";
import { handleApiError } from "@/utils/handleApiError";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "phosphor-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface DeletePotModalProps {
  onClose: () => void;
  pot: PotProps;
  onSubmitForm: () => Promise<void>;
}

export function DeletePotModal({
  pot,
  onClose,
  onSubmitForm,
}: DeletePotModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeletePot = async () => {
    try {
      setIsSubmitting(true);

      const response = await api.delete(`/pots/${pot.id}`);
      toast?.success(response.data.message);

      await onSubmitForm();
      onClose();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[990] bg-black bg-opacity-70" />

      <Dialog.Content
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-pot-title"
        aria-describedby="delete-pot-description"
        className="fixed z-[999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] bg-white rounded-lg shadow-lg p-6 md:w-[560px] md:p-8 outline-none"
      >
        <Dialog.Close
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-grey-900 hover:text-white transition-all duration-300 text-grey-500 p-[0.1rem] rounded-full border border-grey-900"
        >
          <X size={16} aria-hidden="true" />
          <span className="sr-only">Close modal</span>
        </Dialog.Close>

        <Dialog.Title
          id="delete-pot-title"
          className="text-xl font-semibold text-grey-900 mb-2 md:text-2xl"
        >
          {`Delete "${pot.name}"`}
        </Dialog.Title>

        <Dialog.Description
          id="delete-pot-description"
          className="flex flex-col w-full text-sm text-grey-500"
        >
          Are you sure you want to delete this pot? This action cannot be
          reversed, and all the data inside it will be removed forever.
        </Dialog.Description>

        <div className="flex flex-col w-full gap-4 mt-10">
          <DeleteButton
            type="button"
            disabled={isSubmitting}
            onClick={handleDeletePot}
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
  );
}
