import { Pencil, Trash2 } from "lucide-react";
import { RecurringBillProps } from "@/types/recurring-bills";

interface Props {
  bill: RecurringBillProps;
  newAmount?: number;
  onEdit?: (bill: RecurringBillProps, newAmount: number) => void;
  onDelete?: (bill: RecurringBillProps) => void;
  isDisabled?: boolean;
}

export const ActionsSection = ({
  bill,
  newAmount,
  isDisabled = false,
  onDelete,
  onEdit,
}: Props) => {
  return (
    <td className="px-4 py-3.5 text-center align-middle">
      <div className="flex items-center justify-center gap-1">
        <button
          onClick={() => onEdit?.(bill, newAmount as number)}
          aria-label={`Edit bill with ${bill.contactName}`}
          disabled={isDisabled}
          className="p-1 text-ink-300 hover:text-ink-50 transition-colors focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
          title="Edit bill"
        >
          <Pencil size={15} />
        </button>

        <button
          onClick={() => onDelete?.(bill)}
          disabled={isDisabled}
          aria-label={`Delete bill with ${bill.contactName}`}
          className="p-1 text-ink-300 hover:text-accent-red transition-colors focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
          title="Delete bill"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </td>
  );
};
