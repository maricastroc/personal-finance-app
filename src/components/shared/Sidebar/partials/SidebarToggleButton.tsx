import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tooltip } from "react-tooltip";

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
        ${!isOpen ? "justify-center w-full" : ""}
        focus:rounded-md
        focus:outline-none 
        focus:outline-2
        focus:outline-offset-2 
        focus:outline-white
        transition-all duration-300
      `}
    >
      {isOpen ? (
        <ChevronLeft
          className="text-white/40 text-2xl"
          style={{ marginLeft: 0 }}
          size={24}
        />
      ) : (
        <>
          <ChevronRight
            className="text-white/40 text-2xl"
            size={24}
            data-tooltip-id="sidebar-toggle"
            data-tooltip-content="Expand menu"
          />
          <Tooltip
            id="sidebar-toggle"
            place="right"
            className="custom-tooltip"
          />
        </>
      )}

      {isOpen && (
        <span className="text-white/40 font-semibold text-sm">
          Minimize Menu
        </span>
      )}
    </button>
  );
}
