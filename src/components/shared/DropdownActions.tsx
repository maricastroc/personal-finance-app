import { useOutsideAndEscape } from "@/hooks/useClickOutside";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  setIsDeleteOpen: (value: boolean) => void;
  setIsEditOpen: (value: boolean) => void;
  editText: string;
  deleteText: string;
}

export const DropdownActions = ({
  setIsDeleteOpen,
  setIsEditOpen,
  setIsOpen,
  isOpen,
  editText,
  deleteText,
}: Props) => {
  const dropdownRef = useOutsideAndEscape<HTMLDivElement>({
    enabled: isOpen,
    onClickOutside: () => setIsOpen(false),
    onEscape: () => setIsOpen(false),
  });

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-[1.5rem] w-[8.5rem] p-3 rounded-lg flex flex-col gap-2 z-10"
      style={{
        background: "var(--surface-700)",
        border: "1px solid var(--card-border)",
        boxShadow: "var(--shadow-dropdown)",
      }}
    >
      <button
        type="button"
        onClick={() => {
          setIsEditOpen(true);
          setIsOpen(false);
        }}
        className="text-sm text-left text-ink-100 hover:text-ink-50 focus:outline-none focus:ring-1 focus:ring-accent-green rounded"
      >
        {editText}
      </button>

      <span className="h-px w-full bg-surface-600" />

      <button
        type="button"
        onClick={() => {
          setIsDeleteOpen(true);
          setIsOpen(false);
        }}
        className="text-sm text-left text-accent-red hover:brightness-125 focus:outline-none focus:ring-1 focus:ring-accent-green rounded"
      >
        {deleteText}
      </button>
    </div>
  );
};
