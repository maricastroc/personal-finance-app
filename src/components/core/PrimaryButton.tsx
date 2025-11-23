import clsx from "clsx";
import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isSubmitting?: boolean;
  children: ReactNode;
  variant?: "default" | "outline" | "secondary";
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
      "w-full font-semibold rounded-md p-3 py-4 items-center flex gap-2 transition-all duration-300 max-h-[60px] justify-center disabled:cursor-not-allowed focus:outline-offset-4 focus:outline-2 focus:outline-secondary-green";

    const variantClasses = {
      default:
        "bg-grey-900 text-beige-100 hover:bg-grey-500 disabled:bg-grey-300 disabled:text-white disabled:hover:bg-grey-300",

      secondary:
        "bg-beige-100 text-grey-900 hover:brightness-90 disabled:bg-grey-300 disabled:text-white disabled:hover:brightness-100",

      outline:
        "border border-black text-black bg-transparent hover:bg-grey-500 hover:text-white hover:border-transparent disabled:border-grey-300 disabled:text-grey-300 disabled:hover:bg-transparent disabled:hover:text-grey-300 disabled:hover:border-grey-300",
    };

    return (
      <button
        ref={ref}
        type={props.type ?? "button"}
        disabled={isSubmitting || disabled}
        className={clsx(baseClasses, variantClasses[variant], className)}
        {...props}
      >
        {isSubmitting ? "Loading..." : children}
      </button>
    );
  }
);

PrimaryButton.displayName = "PrimaryButton";
