import { DeleteButton } from "@/components/core/DeleteButton";
import { PrimaryButton } from "@/components/core/PrimaryButton";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "phosphor-react";

interface DeleteModalProps {
  id: string;
  onClose: () => void;
  isSubmitting: boolean;
  onDelete: () => Promise<void>;
  title: string;
  description: string;
}

export function DeleteModal({
  id,
  onClose,
  isSubmitting,
  title,
  description,
  onDelete,
}: DeleteModalProps) {
  return (
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
              p-[0.1rem] rounded-full border border-grey-900 
              focus:outline-offset-2"
        >
          <X size={16} />
        </Dialog.Close>

        <Dialog.Title
          id={`${id}-title`}
          className="text-xl font-semibold text-grey-900 mb-2 md:text-2xl"
        >
          Delete “{title}”?
        </Dialog.Title>

        <Dialog.Description
          id={`${id}-desc`}
          className="flex flex-col w-full text-sm text-grey-500"
        >
          {description}
        </Dialog.Description>

        <div className="flex flex-col w-full gap-4 mt-10">
          <DeleteButton
            type="button"
            disabled={isSubmitting}
            onClick={onDelete}
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
