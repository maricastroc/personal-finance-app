import * as Dialog from "@radix-ui/react-dialog";
import { X } from "phosphor-react";
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
      <Dialog.Overlay className="fixed inset-0 z-[990] bg-black bg-opacity-70" />

      <Dialog.Content
        id={id}
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-desc`}
        className="max-h-[90vh] overflow-y-auto fixed z-[999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    w-[90vw] md:w-[560px] bg-white rounded-lg shadow-lg p-6 md:p-8"
      >
        <Dialog.Close
          aria-label="Close modal"
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-grey-900 hover:text-white
              transition-all duration-300 text-grey-500 p-[0.1rem]
              rounded-full border border-grey-900 focus:outline-offset-2"
        >
          <X size={16} />
        </Dialog.Close>

        <Dialog.Title
          id={`${id}-title`}
          className="text-xl md:text-2xl font-semibold text-grey-900 mb-2"
        >
          {title}
        </Dialog.Title>

        <Dialog.Description
          id={`${id}-desc`}
          className="text-sm text-grey-500 mb-4"
        >
          {description}
        </Dialog.Description>

        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
