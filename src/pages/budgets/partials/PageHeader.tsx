/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Dialog from "@radix-ui/react-dialog";
import { BudgetModal } from "./BudgetModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { getBudgetsCategories } from "@/utils/getBudgetsCategories";
import { AxiosResponse } from "axios";
import { KeyedMutator } from "swr";
import { PrimaryButton } from "@/components/core/PrimaryButton";
import { PageTitle } from "@/components/shared/PageTitle";
import { BudgetProps } from "@/types/budget";

interface PageHeaderProps {
  isBudgetModalOpen: boolean;
  setIsBudgetModalOpen: (value: boolean) => void;
  budgets: BudgetProps[] | undefined;
  mutate: KeyedMutator<AxiosResponse<BudgetProps[], any>>;
}

export const PageHeader = ({
  isBudgetModalOpen,
  budgets,
  setIsBudgetModalOpen,
  mutate,
}: PageHeaderProps) => {
  return (
    <header
      className="flex items-center justify-between w-full mb-8"
      aria-label="Budgets Header"
    >
      <PageTitle
        title="Budgets"
        description="Manage your budgets and track your spending."
      />

      <Dialog.Root open={isBudgetModalOpen} onOpenChange={setIsBudgetModalOpen}>
        <Dialog.Trigger asChild>
          <PrimaryButton
            aria-haspopup="dialog"
            aria-expanded={isBudgetModalOpen}
            aria-controls="budget-modal"
            className="mt-0 max-w-[8rem] text-sm"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Budget
          </PrimaryButton>
        </Dialog.Trigger>

        <BudgetModal
          id="budget-modal"
          budgets={budgets}
          onClose={() => setIsBudgetModalOpen(false)}
          selectedBudgetsCategories={getBudgetsCategories(budgets)}
          onSubmitForm={async () => {
            await mutate();
          }}
        />
      </Dialog.Root>
    </header>
  );
};
