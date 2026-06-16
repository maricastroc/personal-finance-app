import { CaretLeft, CaretRight } from "phosphor-react";

interface SidebarToggleButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function SidebarToggleButton({
  isOpen,
  onToggle,
}: SidebarToggleButtonProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={isOpen ? "Collapse menu" : "Expand menu"}
      aria-expanded={isOpen}
      className={`
        flex items-center gap-3 
        ${isOpen ? "ml-6" : "ml-4"}
        mr-6
        focus:rounded-md
        focus:outline-none 
        focus:outline-2
        focus:outline-offset-2 
        focus:outline-white
        transition-all duration-300
      `}
    >
      {isOpen ? (
        <CaretLeft className="text-grey-300 text-2xl" style={{ marginLeft: 0 }} size={24} />
      ) : (
        <CaretRight className="text-grey-300 text-2xl" style={{ marginLeft: 20 }} size={24} />
      )}

      <span
        className={`
          text-grey-300 font-semibold text-sm
          transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        Minimize Menu
      </span>
    </button>
  );
}
