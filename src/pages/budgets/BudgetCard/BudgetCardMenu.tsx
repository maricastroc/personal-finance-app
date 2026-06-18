import { useOutsideAndEscape } from "@/hooks/useClickOutside";
import { MoreHorizontal } from "lucide-react";
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
        className="text-ink-300 hover:text-ink-100"
      >
        <MoreHorizontal size={20} />
      </button>

      {open && (
        <div
          id={`budget-menu-${budgetId}`}
          role="menu"
          className="absolute top-[1.5rem] right-0 w-[8.5rem] p-3 rounded-lg flex flex-col gap-1 z-10"
          style={{
            background: "var(--surface-700)",
            border: "1px solid var(--card-border)",
            boxShadow: "var(--shadow-dropdown)",
          }}
        >
          <button
            role="menuitem"
            type="button"
            className="text-sm text-left"
            onClick={onEdit}
          >
            Edit Budget
          </button>

          <span className="my-1 h-px bg-surface-600" />

          <button
            role="menuitem"
            type="button"
            className="text-sm text-left text-accent-red hover:brightness-150"
            onClick={onDelete}
          >
            Delete Budget
          </button>
        </div>
      )}
    </div>
  );
}
