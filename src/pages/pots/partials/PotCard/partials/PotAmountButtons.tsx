import * as Dialog from "@radix-ui/react-dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

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
            className="bg-beige-100 w-full rounded-md py-4 px-3 hover:brightness-90 focus:outline-secondary-green focus:outline-offset-2 focus:outline-2"
          >
            <FontAwesomeIcon icon={faPlus} className="text-sm mr-1" />
            Add Money
          </button>
        </Dialog.Trigger>

        <EditPotAmountModal
          id={pot.id}
          name={pot.name}
          currentAmount={pot.currentAmount}
          targetAmount={pot.targetAmount}
          themeColor={pot.theme.color}
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
            className="bg-beige-100 w-full rounded-md py-4 px-3 hover:brightness-90 focus:outline-secondary-green focus:outline-offset-2 focus:outline-2"
          >
            <FontAwesomeIcon icon={faMinus} className="text-sm mr-1" />
            Withdraw
          </button>
        </Dialog.Trigger>

        <EditPotAmountModal
          isWithdraw
          id={pot.id}
          name={pot.name}
          currentAmount={pot.currentAmount}
          targetAmount={pot.targetAmount}
          themeColor={pot.theme.color}
          originalPercentage={originalPercentage}
          onClose={() => setIsWithdrawOpen(false)}
          onSubmitForm={refreshAll}
        />
      </Dialog.Root>
    </div>
  );
}
