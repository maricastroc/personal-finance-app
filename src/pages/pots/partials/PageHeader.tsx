import { PrimaryButton } from "@/components/core/PrimaryButton";
import { PageTitle } from "@/components/shared/PageTitle";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode } from "react";

interface PageHeaderProps {
  buttonLabel: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  modalId: string;
  children: ReactNode;
}

export function PageHeader({
  buttonLabel,
  isOpen,
  setIsOpen,
  modalId,
  children,
}: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between w-full mb-8">
      <PageTitle title="Pots" />

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
          <PrimaryButton
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-controls={modalId}
            className="mt-0 max-w-[8rem] text-sm"
          >
            <FontAwesomeIcon icon={faPlus} />
            {buttonLabel}
          </PrimaryButton>
        </Dialog.Trigger>

        {children}
      </Dialog.Root>
    </header>
  );
}
