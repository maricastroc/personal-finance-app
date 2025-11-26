import { Pencil, Trash } from "phosphor-react";
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
    <td className="px-4 py-2 text-center align-middle">
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => onEdit?.(bill, newAmount as number)}
          aria-label={`Edit transaction with ${bill.contactName}`}
          disabled={isDisabled}
          className="focus:ring-2 focus:outline-none focus:border-transparent focus:ring-offset-2 p-[0.3rem] focus:ring-secondary-green text-white disabled:bg-grey-300 disabled:cursor-not-allowed hover:bg-secondary-greenHover rounded-full flex items-center bg-secondary-green transition-colors"
          title="Edit transaction"
        >
          <Pencil size={16} />
        </button>

        <button
          onClick={() => onDelete?.(bill)}
          disabled={isDisabled}
          aria-label={`Delete transaction with ${bill.contactName}`}
          className="focus:ring-2 focus:outline-none focus:border-transparent focus:ring-offset-2 focus:ring-secondary-green p-[0.3rem] text-white disabled:bg-grey-300 disabled:cursor-not-allowed hover:bg-secondary-redHover rounded-full flex items-center bg-secondary-red transition-colors"
          title="Delete transaction"
        >
          <Trash size={16} />
        </button>
      </div>
    </td>
  );
};
