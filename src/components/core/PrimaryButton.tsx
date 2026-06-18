import clsx from "clsx";
import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isSubmitting?: boolean;
  children: ReactNode;
  variant?: "default" | "outline" | "secondary" | "small";
  className?: string;
}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  (
    {
      isSubmitting = false,
      children,
      variant = "default",
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "w-full font-medium text-sm rounded-md p-3 py-3 items-center flex gap-2 transition-all duration-200 max-h-[60px] justify-center disabled:cursor-not-allowed focus:outline-offset-4 focus:outline-2 focus:outline-accent-green";

    const smallClasses =
      "font-semibold text-xs rounded transition-colors items-center flex gap-1.5 justify-center disabled:cursor-not-allowed focus:outline-none";

    const variantClasses = {
      default:
        "bg-gradient-to-b from-[#F8FAFC] to-[#E5E7EB] text-[#111827] shadow-md hover:from-white hover:to-[#F3F4F6] hover:shadow-xl active:scale-[0.99] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed rounded-xl",

      secondary:
        "bg-surface-700 text-ink-100 border border-surface-500 hover:bg-surface-600 disabled:bg-surface-800 disabled:text-ink-300",

      outline:
        "border border-surface-500 text-ink-100 bg-transparent hover:bg-surface-700 hover:border-surface-400 disabled:border-surface-600 disabled:text-ink-300 disabled:hover:bg-transparent",

      small:
        "bg-surface-700 text-ink-200 border border-surface-500 hover:bg-surface-600 hover:border-surface-400 disabled:bg-surface-800 disabled:text-ink-300 disabled:hover:bg-surface-800 px-3 py-1.5",
    };

    const baseClass = variant === "small" ? smallClasses : baseClasses;

    return (
      <button
        ref={ref}
        type={props.type ?? "button"}
        disabled={isSubmitting || disabled}
        className={clsx(baseClass, variantClasses[variant], className)}
        {...props}
      >
        {isSubmitting ? "Loading..." : children}
      </button>
    );
  }
);

PrimaryButton.displayName = "PrimaryButton";
