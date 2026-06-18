import * as Dialog from "@radix-ui/react-dialog";
import { Plus, Minus } from "lucide-react";

import { PotProps } from "@/types/pot";
import { EditPotAmountModal } from "../../EditPotAmountModal";

interface Props {
  pot: PotProps;
  originalPercentage: number;
  isAddOpen: boolean;
  setIsAddOpen: (v: boolean) => void;
  isWithdrawOpen: boolean;
  setIsWithdrawOpen: (v: boolean) => void;
  refreshAll: () => void;
}

export function PotAmountButtons({
  pot,
  originalPercentage,
  isAddOpen,
  setIsAddOpen,
  isWithdrawOpen,
  setIsWithdrawOpen,
  refreshAll,
}: Props) {
  return (
    <div className="flex items-center w-full gap-3 mt-12">
      <Dialog.Root open={isAddOpen} onOpenChange={setIsAddOpen}>
        <Dialog.Trigger asChild>
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-surface-700 text-ink-200 text-sm font-medium w-full rounded-lg py-3 px-3 hover:bg-surface-600 transition-colors focus:outline-none focus:ring-1 focus:ring-accent-green flex items-center justify-center gap-1.5"
          >
            <Plus size={14} />
            Add Money
          </button>
        </Dialog.Trigger>

        <EditPotAmountModal
          id={pot.id}
          name={pot.name}
          currentAmount={pot.currentAmount}
          targetAmount={pot.targetAmount}
          theme={pot.theme}
          originalPercentage={originalPercentage}
          onClose={() => setIsAddOpen(false)}
          onSubmitForm={refreshAll}
        />
      </Dialog.Root>

      <Dialog.Root open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <Dialog.Trigger asChild>
          <button
            type="button"
            onClick={() => setIsWithdrawOpen(true)}
            className="bg-surface-700 text-ink-200 text-sm font-medium w-full rounded-lg py-3 px-3 hover:bg-surface-600 transition-colors focus:outline-none focus:ring-1 focus:ring-accent-green flex items-center justify-center gap-1.5"
          >
            <Minus size={14} />
            Withdraw
          </button>
        </Dialog.Trigger>

        <EditPotAmountModal
          isWithdraw
          id={pot.id}
          name={pot.name}
          currentAmount={pot.currentAmount}
          targetAmount={pot.targetAmount}
          theme={pot.theme}
          originalPercentage={originalPercentage}
          onClose={() => setIsWithdrawOpen(false)}
          onSubmitForm={refreshAll}
        />
      </Dialog.Root>
    </div>
  );
}
