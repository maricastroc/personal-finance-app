/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pencil, Trash } from "phosphor-react";
import * as Dialog from "@radix-ui/react-dialog";
import { TransactionProps } from "@/types/transaction";
import { CategoryProps } from "@/types/category";
import { TransferFormModal } from "./TransferFormModal";
import { AxiosResponse } from "axios";
import { KeyedMutator } from "swr";

interface Props {
  transaction: TransactionProps;
  isEditModalOpen: boolean;
  categories: CategoryProps[] | undefined;
  setIsEditModalOpen: (value: boolean) => void;
  onEdit?: (transaction: TransactionProps) => void;
  onDelete?: (transaction: TransactionProps) => void;
  mutate: KeyedMutator<AxiosResponse<TransactionProps[] | any>>;
}

export const ActionsSection = ({
  transaction,
  isEditModalOpen,
  categories,
  onDelete,
  onEdit,
  setIsEditModalOpen,
  mutate,
}: Props) => {
  return (
    <td className="px-4 py-2 text-center align-middle">
      <div className="flex items-center justify-center gap-2">
        <Dialog.Root open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <Dialog.Trigger asChild>
            <button
              onClick={() => onEdit?.(transaction)}
              aria-label={`Edit transaction with ${transaction.contactName}`}
              className="p-[0.3rem] text-white hover:bg-secondary-greenHover rounded-full flex items-center bg-secondary-green transition-colors"
              title="Edit transaction"
            >
              <Pencil size={16} />
            </button>
          </Dialog.Trigger>

          {categories && (
            <TransferFormModal
              isEdit
              transaction={transaction}
              id="transfer-form-modal"
              categories={categories}
              onSubmitForm={async (): Promise<void> => {
                await mutate();
              }}
              onClose={() => setIsEditModalOpen(false)}
            />
          )}
        </Dialog.Root>

        <button
          onClick={() => onDelete?.(transaction)}
          aria-label={`Delete transaction with ${transaction.contactName}`}
          className="p-[0.3rem] text-white hover:bg-secondary-redHover rounded-full flex items-center bg-secondary-red transition-colors"
          title="Delete transaction"
        >
          <Trash size={16} />
        </button>
      </div>
    </td>
  );
};
