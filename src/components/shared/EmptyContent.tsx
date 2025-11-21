import clsx from "clsx";
import { Plus } from "phosphor-react";
import { PrimaryButton } from "../core/PrimaryButton";

interface EmptyContentProps {
  content: string;
  description?: string;
  variant?: "primary" | "secondary";
  className?: string;
  icon?: React.ReactNode;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

export const EmptyContent = ({
  content,
  description,
  variant = "primary",
  className = "",
  icon,
  buttonLabel = "Add New",
  onButtonClick,
}: EmptyContentProps) => {
  if (!content) return null;

  const defaultIcon = (
    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
      <Plus size={32} className="text-gray-400" />
    </div>
  );

  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        "flex flex-col shadow-lg items-center justify-center text-center gap-4 w-full p-8 rounded-lg min-h-48",
        variant === "primary"
          ? "bg-beige-100 border border-beige-200"
          : "bg-white border border-gray-200",
        className
      )}
    >
      <div className="flex items-center justify-center">
        {icon || defaultIcon}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-lg font-semibold text-gray-900">{content}</p>
        <p className="text-sm text-gray-500 max-w-xs">
          {description || "Get started by creating your first item."}
        </p>
      </div>

      {onButtonClick && (
        <PrimaryButton
          onClick={onButtonClick}
          className="mt-2 !py-3 !w-auto !text-sm"
        >
          <Plus size={16} />
          {buttonLabel}
        </PrimaryButton>
      )}
    </div>
  );
};
