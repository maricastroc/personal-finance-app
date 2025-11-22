/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import React from "react";

type BaseProps = {
  children: React.ReactNode;
  className?: string;
  as?: "a" | "button";
} & React.HTMLAttributes<HTMLElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export function TextLink({
  as = "a",
  className = "",
  children,
  ...props
}: BaseProps) {
  const Component = as as any;

  return (
    <Component
      className={clsx(
        "font-semibold underline underline-offset-4",
        "focus:outline-offset-2 focus:outline-2 focus:outline-grey-900",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
