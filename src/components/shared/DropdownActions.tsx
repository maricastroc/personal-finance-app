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
      className="absolute top-[1.5rem] w-[8.5rem] bg-white shadow-xl p-3 rounded-lg flex flex-col gap-2 z-10"
    >
      <button
        type="button"
        onClick={() => {
          setIsEditOpen(true);
          setIsOpen(false);
        }}
        className="text-sm text-left text-grey-900 hover:text-grey-500 focus:outline-secondary-green focus:outline-offset-2 focus:outline-2"
      >
        {editText}
      </button>

      <span className="h-[1px] w-full bg-grey-300" />

      <button
        type="button"
        onClick={() => {
          setIsDeleteOpen(true);
          setIsOpen(false);
        }}
        className="text-sm text-left text-secondary-red focus:outline-secondary-green focus:outline-offset-2 focus:outline-2 hover:brightness-125"
      >
        {deleteText}
      </button>
    </div>
  );
};
