import { DeleteButton } from "@/components/core/DeleteButton";
import { PrimaryButton } from "@/components/core/PrimaryButton";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

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
      <Dialog.Overlay className="fixed inset-0 z-[990] bg-black/60 backdrop-blur-sm" />
      <Dialog.Content
        id={id}
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-desc`}
        className="fixed z-[999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[560px] rounded-xl shadow-2xl p-6 md:p-8"
        style={{
          background: "var(--surface-800)",
          border: "1px solid var(--card-border)",
        }}
      >
        <Dialog.Close
          aria-label="Close modal"
          onClick={onClose}
          className="absolute top-4 right-4 text-ink-400 hover:text-ink-100 hover:bg-surface-700 transition-all duration-200 p-1 rounded-full focus:outline-none focus:ring-1 focus:ring-accent-green"
        >
          <X size={16} />
        </Dialog.Close>

        <Dialog.Title
          id={`${id}-title`}
          className="text-xl font-semibold text-ink-50 mb-2 md:text-2xl"
        >
          Delete &ldquo;{title}&rdquo;?
        </Dialog.Title>

        <Dialog.Description
          id={`${id}-desc`}
          className="flex flex-col w-full text-sm text-ink-300"
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
