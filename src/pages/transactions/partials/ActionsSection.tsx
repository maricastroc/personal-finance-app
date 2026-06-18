import { Pencil, Trash2 } from "lucide-react";
import { TransactionProps } from "@/types/transaction";

interface Props {
  transaction: TransactionProps;
  onEdit?: (transaction: TransactionProps) => void;
  onDelete?: (transaction: TransactionProps) => void;
  isDisabled?: boolean;
}

export const ActionsSection = ({
  transaction,
  isDisabled = false,
  onDelete,
  onEdit,
}: Props) => {
  return (
    <td className="px-4 py-2 text-center align-middle">
      <div className="flex items-center justify-center gap-1">
        <button
          onClick={() => onEdit?.(transaction)}
          aria-label={`Edit transaction with ${transaction.contactName}`}
          disabled={isDisabled}
          className="p-1 text-ink-300 hover:text-ink-50 transition-colors focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
          title="Edit transaction"
        >
          <Pencil size={15} />
        </button>

        <button
          onClick={() => onDelete?.(transaction)}
          disabled={isDisabled}
          aria-label={`Delete transaction with ${transaction.contactName}`}
          className="p-1 text-ink-300 hover:text-accent-red transition-colors focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
          title="Delete transaction"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </td>
  );
};
