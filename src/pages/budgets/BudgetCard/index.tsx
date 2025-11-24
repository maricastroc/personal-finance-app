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

interface BudgetCardProps {
  budgetId: string;
  budgets: BudgetProps[] | undefined;
  onSubmitForm: () => Promise<void>;
}

interface BudgetResult {
  budget: BudgetProps;
  percentageSpent: number;
  amountSpent: number;
  transactions: TransactionProps[];
}

export default function BudgetCard({
  budgetId,
  budgets,
  onSubmitForm,
}: BudgetCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const router = useRouter();

  const { data, mutate, isValidating } = useRequest<BudgetResult>(
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
      const response = await api.delete(`/budgets/${data?.budget.id}`);

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

  const pct = Math.min(100, data?.percentageSpent || 0);

  const free = (data?.budget?.amount || 0) - (data?.amountSpent || 0);

  return (
    <section className="flex flex-col bg-white px-5 py-6 rounded-md md:p-10">
      <BudgetCardHeader
        categoryName={data?.budget?.category?.name || ""}
        theme={data?.budget?.theme?.color || ""}
        isLoading={isValidating}
      >
        <BudgetCardMenu
          budgetId={budgetId}
          onEdit={() => setIsEditOpen(true)}
          onDelete={() => setIsDeleteOpen(true)}
        />
      </BudgetCardHeader>

      <BudgetCardLimitInfo
        limit={data?.budget?.amount || 0}
        pct={pct}
        theme={data?.budget?.theme?.color || ""}
      />

      <BudgetCardSpentInfo spent={data?.budget?.amount || 0} free={free} />

      <BudgetCardTransactions
        transactions={data?.transactions || []}
        isLoading={isValidating}
        onSeeAll={() =>
          router.push({
            pathname: "/transactions",
            query: { category: data?.budget?.category?.name },
          })
        }
      />

      {data?.budget && (
        <Dialog.Root open={isEditOpen} onOpenChange={setIsEditOpen}>
          <BudgetModal
            isEdit
            id="budget-modal"
            onClose={() => setIsEditOpen(false)}
            budgets={budgets}
            budget={data?.budget}
            onSubmitForm={async () => {
              await mutate();
              await onSubmitForm();
            }}
          />
        </Dialog.Root>
      )}

      {data?.budget && (
        <Dialog.Root open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DeleteModal
            id="delete-budget-modal"
            title={data?.budget?.category?.name}
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
