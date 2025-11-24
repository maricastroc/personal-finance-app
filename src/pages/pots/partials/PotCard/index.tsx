/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

import { AxiosResponse } from "axios";
import { PotCardHeader } from "./partials/PotCardHeader";
import { PotCardValue } from "./partials/PotCardValue";
import { PotProgressBar } from "./partials/PotProgressBar";
import { PotAmountButtons } from "./partials/PotAmountButtons";
import { DeletePotModal } from "../DeletePotModal";
import { PotFormModal } from "../PotFormModal";
import { PotsResult } from "@/types/pots-result";
import { PotProps } from "@/types/pot";
import { KeyedMutator } from "swr";

interface PotCardProps {
  pot: PotProps;
  pots: PotProps[] | undefined;
  mutate: KeyedMutator<AxiosResponse<PotsResult, any>>;
  onSubmitForm: () => Promise<
    void | AxiosResponse<PotsResult, any> | undefined
  >;
}

export const PotCard = ({ pot, pots, onSubmitForm, mutate }: PotCardProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  async function refreshAll() {
    await mutate();
    await onSubmitForm();
    setIsDropdownOpen(false);
  }

  const percentage = (pot.currentAmount / pot.targetAmount) * 100;

  const originalPercentage = Math.max(
    0,
    Math.min(100, (pot?.currentAmount / pot?.targetAmount) * 100)
  );

  return (
    <div className="flex flex-col bg-white px-5 py-6 rounded-md md:p-10">
      <PotCardHeader
        pot={pot}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        setIsEditOpen={setIsEditOpen}
        setIsDeleteOpen={setIsDeleteOpen}
      />

      <PotCardValue pot={pot} />

      <PotProgressBar
        percentage={percentage}
        color={pot.theme.color}
        target={pot.targetAmount}
      />

      <PotAmountButtons
        pot={pot}
        originalPercentage={originalPercentage}
        isAddOpen={isAddOpen}
        setIsAddOpen={setIsAddOpen}
        isWithdrawOpen={isWithdrawOpen}
        setIsWithdrawOpen={setIsWithdrawOpen}
        refreshAll={refreshAll}
      />

      <Dialog.Root open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DeletePotModal
          onSubmitForm={async () => {
            await mutate();
            await onSubmitForm();
            setIsDropdownOpen(false);
          }}
          onClose={() => {
            setIsDeleteOpen(false);
            setIsDropdownOpen(false);
          }}
          pot={pot}
        />
      </Dialog.Root>

      <Dialog.Root open={isEditOpen} onOpenChange={setIsEditOpen}>
        <PotFormModal
          isEdit
          id="pot-modal"
          pot={pot}
          pots={pots}
          onClose={() => setIsAddOpen(false)}
          onSubmitForm={async () => {
            await mutate();
            await onSubmitForm();
            setIsDropdownOpen(false);
          }}
        />
      </Dialog.Root>
    </div>
  );
};
