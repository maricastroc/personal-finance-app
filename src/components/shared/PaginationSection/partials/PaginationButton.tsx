import { ChevronLeft, ChevronRight } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

interface PaginationBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  number: number;
  variant?: "default" | "left" | "right";
}

export function PaginationBtn({
  number,
  variant = "default",
  ...rest
}: PaginationBtnProps) {
  let content;

  switch (variant) {
    case "default":
      content = number;
      break;
    case "left":
      content = <ChevronLeft />;
      break;
    case "right":
      content = <ChevronRight />;
      break;
    default:
      content = number;
  }

  return (
    <button
      className="rounded-lg focus:ring-1 focus:ring-offset-1 focus:ring-accent-green focus:ring-offset-surface-800 flex items-center gap-3 border border-surface-600 h-10 min-w-10 justify-center bg-surface-700 text-ink-200 px-3 hover:bg-surface-600 hover:text-ink-50 disabled:bg-surface-800 disabled:border-surface-700 disabled:text-ink-400 disabled:cursor-not-allowed transition-all duration-200"
      {...rest}
    >
      {content}
    </button>
  );
}
