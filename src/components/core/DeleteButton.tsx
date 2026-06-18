import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";

interface DeleteButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isSubmitting?: boolean;
  children: ReactNode;
}

export const DeleteButton = forwardRef<HTMLButtonElement, DeleteButtonProps>(
  ({ isSubmitting = false, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={props.type ?? "button"}
        aria-busy={isSubmitting}
        aria-live="polite"
        className="
          font-semibold rounded-md p-3 px-4 flex gap-2 transition-all duration-300
          text-sm bg-accent-red text-white hover:brightness-125 justify-center
          disabled:bg-surface-600 disabled:text-white disabled:cursor-not-allowed
          disabled:hover:brightness-100
        "
        disabled={isSubmitting || disabled}
        {...props}
      >
        {isSubmitting ? "Loading..." : children}
      </button>
    );
  }
);

DeleteButton.displayName = "DeleteButton";
