import * as Dialog from "@radix-ui/react-dialog";
import useRequest from "@/utils/useRequest";
import { useState } from "react";
import { BudgetCardHeader } from "./BudgetCardHeader";
import { TransactionProps } from "@/types/transaction";
import { BudgetProps } from "@/types/budget";
import { BudgetCardMenu } from "./BudgetCardMenu";
import { BudgetCardLimitInfo } from "./BudgetCardLimitInfo";
import { BudgetCardSpentInfo } from "./BudgetCardSpentInfo";
import { BudgetCardTransactions } from "./BudgetCardTransactions";
import { BudgetModal } from "../partials/BudgetModal";
import { useRouter } from "next/router";
import { DeleteModal } from "@/components/shared/DeleteModal";
import { api } from "@/lib/axios";
import toast from "react-hot-toast";
import { handleApiError } from "@/utils/handleApiError";

interface DetailsProps {
  categoryName: string;
  amountSpent: number;
  theme: string;
  budgetLimit: number;
  percentageSpent: number;
}

interface BudgetCardProps {
  budgetId: string;
  onSubmitForm: () => Promise<void>;
}

interface BudgetWithDetailsProps {
  budget: BudgetProps;
  budgetDetails: DetailsProps;
  transactions: TransactionProps[];
}

export default function BudgetCard({
  budgetId,
  onSubmitForm,
}: BudgetCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const router = useRouter();

  const {
    data: budget,
    mutate,
    isValidating,
  } = useRequest<BudgetWithDetailsProps>(
    {
      url: `/budgets/${budgetId}`,
      method: "GET",
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
      dedupingInterval: 20000,
      focusThrottleInterval: 30000,
      keepPreviousData: true,
    }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteBudget = async () => {
    try {
      setIsSubmitting(true);
      const response = await api.delete(`/budgets/${budget?.budget.id}`);

      toast.success(response.data.message);

      await mutate();
      await onSubmitForm();

      setIsDeleteOpen(false);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pct = Math.min(100, budget?.budgetDetails.percentageSpent || 0);

  const free =
    (budget?.budgetDetails.budgetLimit || 0) -
    (budget?.budgetDetails.amountSpent || 0);

  return (
    <section className="flex flex-col bg-white px-5 py-6 rounded-md md:p-10">
      <BudgetCardHeader
        categoryName={budget?.budgetDetails.categoryName || ""}
        theme={budget?.budgetDetails.theme || ""}
        isLoading={isValidating}
      >
        <BudgetCardMenu
          budgetId={budgetId}
          onEdit={() => setIsEditOpen(true)}
          onDelete={() => setIsDeleteOpen(true)}
        />
      </BudgetCardHeader>

      <BudgetCardLimitInfo
        limit={budget?.budgetDetails.budgetLimit || 0}
        pct={pct}
        theme={budget?.budgetDetails.theme || ""}
      />

      <BudgetCardSpentInfo
        spent={budget?.budgetDetails.amountSpent || 0}
        free={free}
      />

      <BudgetCardTransactions
        transactions={budget?.transactions || []}
        isLoading={isValidating}
        onSeeAll={() =>
          router.push({
            pathname: "/transactions",
            query: { category: budget?.budgetDetails.categoryName },
          })
        }
      />

      {budget && (
        <Dialog.Root open={isEditOpen} onOpenChange={setIsEditOpen}>
          <BudgetModal
            isEdit
            id="budget-modal"
            onClose={() => setIsEditOpen(false)}
            budgetId={budgetId}
            categoryName={budget.budgetDetails.categoryName}
            budgetLimit={budget.budgetDetails.budgetLimit}
            theme={budget.budgetDetails.theme}
            onSubmitForm={async () => {
              await mutate();
              await onSubmitForm();
            }}
          />
        </Dialog.Root>
      )}

      {budget && (
        <Dialog.Root open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DeleteModal
            id="delete-budget-modal"
            title={budget?.budget?.category?.name}
            description="This action cannot be undone. All associated transactions and data
            for this budget will be permanently removed."
            isSubmitting={isSubmitting}
            onDelete={handleDeleteBudget}
            onClose={() => setIsDeleteOpen(false)}
          />
        </Dialog.Root>
      )}
    </section>
  );
}
