import * as Dialog from "@radix-ui/react-dialog";
import { BudgetModal } from "./BudgetModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { getBudgetsCategories } from "@/utils/getBudgetsCategories";
import { BudgetWithDetailsProps } from "@/components/shared/BudgetItem";
import { AxiosResponse } from "axios";
import { KeyedMutator } from "swr";
import { PrimaryButton } from "@/components/core/PrimaryButton";
import { PageTitle } from "@/components/shared/PageTitle";

interface PageHeaderProps {
  isBudgetModalOpen: boolean;
  setIsBudgetModalOpen: (value: boolean) => void;
  budgets: BudgetWithDetailsProps[] | undefined;
  mutate: KeyedMutator<
    AxiosResponse<BudgetWithDetailsProps[], BudgetWithDetailsProps>
  >;
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
      <PageTitle title="Budgets" />

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
          isOpen={isBudgetModalOpen}
          onOpenChange={() => setIsBudgetModalOpen(!isBudgetModalOpen)}
          onClose={() => setIsBudgetModalOpen(false)}
          existedCategories={getBudgetsCategories(budgets)}
          onSubmitForm={async () => {
            await mutate();
          }}
        />
      </Dialog.Root>
    </header>
  );
};
