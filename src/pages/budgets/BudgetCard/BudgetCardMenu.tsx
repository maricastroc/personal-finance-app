import { useOutsideAndEscape } from "@/hooks/useClickOutside";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

interface BudgetCardMenuProps {
  budgetId: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function BudgetCardMenu({
  budgetId,
  onEdit,
  onDelete,
}: BudgetCardMenuProps) {
  const [open, setOpen] = useState(false);

  const dropdownRef = useOutsideAndEscape<HTMLDivElement>({
    enabled: open,
    onClickOutside: () => setOpen(false),
    onEscape: () => setOpen(false),
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={`budget-menu-${budgetId}`}
        type="button"
        onClick={() => setOpen(!open)}
        className="text-gray-500 hover:text-gray-700"
      >
        <FontAwesomeIcon icon={faEllipsis} />
      </button>

      {open && (
        <div
          id={`budget-menu-${budgetId}`}
          role="menu"
          className="absolute top-[1.5rem] right-0 w-[8.5rem] bg-white shadow-xl p-3 rounded-lg flex flex-col gap-1"
        >
          <button
            role="menuitem"
            type="button"
            className="text-sm text-left"
            onClick={onEdit}
          >
            Edit Budget
          </button>

          <span className="my-1 h-px bg-gray-200" />

          <button
            role="menuitem"
            type="button"
            className="text-sm text-left text-secondary-red hover:brightness-150"
            onClick={onDelete}
          >
            Delete Budget
          </button>
        </div>
      )}
    </div>
  );
}
