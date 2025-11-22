import { Pencil, Trash } from "phosphor-react";
import { TransactionProps } from "@/types/transaction";

interface Props {
  transaction: TransactionProps;
  onEdit?: (transaction: TransactionProps) => void;
  onDelete?: (transaction: TransactionProps) => void;
}

export const ActionsSection = ({ transaction, onDelete, onEdit }: Props) => {
  return (
    <td className="px-4 py-2 text-center align-middle">
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => onEdit?.(transaction)}
          aria-label={`Edit transaction with ${transaction.contactName}`}
          className="p-[0.3rem] text-white hover:bg-secondary-greenHover rounded-full flex items-center bg-secondary-green transition-colors"
          title="Edit transaction"
        >
          <Pencil size={16} />
        </button>

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
