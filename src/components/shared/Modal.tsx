import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  id: string;
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({
  id,
  onClose,
  title,
  description,
  children,
}: ModalProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[990] bg-black/60 backdrop-blur-sm" />

      <Dialog.Content
        id={id}
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-desc`}
        className="max-h-[90vh] overflow-y-auto scrollbar-hide fixed z-[999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[560px] rounded-xl shadow-2xl p-6 md:p-8"
        style={{
          background: "var(--surface-800)",
          border: "1px solid var(--card-border)",
        }}
      >
        <Dialog.Close
          aria-label="Close modal"
          onClick={onClose}
          className="absolute top-4 right-4 text-ink-400 hover:text-ink-100 hover:bg-surface-700 transition-all duration-200 p-1 rounded-full focus:outline-2 focus:outline-accent-green focus:outline-offset-1"
        >
          <X size={16} />
        </Dialog.Close>

        <Dialog.Title
          id={`${id}-title`}
          className="text-xl md:text-2xl font-semibold text-ink-50 mb-2"
        >
          {title}
        </Dialog.Title>

        <Dialog.Description
          id={`${id}-desc`}
          className="text-sm text-ink-300 mb-4"
        >
          {description}
        </Dialog.Description>

        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
