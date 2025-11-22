import { SkeletonFinanceCard } from "@/components/skeletons/SkeletonFinanceCard";
import { ReactNode } from "react";
import clsx from "clsx";

interface FinanceCardProps {
  title: string;
  value: string;
  variant?: "primary" | "secondary" | "tertiary" | "income" | "outcome";
  isValidating?: boolean;
  icon?: ReactNode;
}

const variants = {
  primary: {
    card: "bg-grey-900",
    title: "text-beige-100",
    value: "text-beige-100",
  },
  income: {
    card: "bg-white",
    title: "text-grey-500",
    value: "text-secondary-green",
  },
  outcome: {
    card: "bg-white",
    title: "text-grey-500",
    value: "text-secondary-red",
  },
  secondary: {
    card: "bg-white",
    title: "text-grey-500",
    value: "text-grey-900",
  },
  tertiary: {
    card: "bg-beige-100",
    title: "text-grey-500",
    value: "text-grey-900",
  },
};

export function FinanceCard({
  title,
  value,
  variant = "primary",
  isValidating = false,
  icon,
}: FinanceCardProps) {
  if (isValidating) return <SkeletonFinanceCard />;

  const v = variants[variant];

  return (
    <article
      aria-label={`${title}: ${value}`}
      className={clsx(
        "flex items-center gap-2 h-full w-full p-4 rounded-lg md:h-32 lg:h-[7.4rem]",
        v.card
      )}
    >
      {icon && (
        <div className="mr-4" aria-hidden="true">
          {icon}
        </div>
      )}

      <div className="flex flex-col">
        <h2 className={clsx("text-sm font-medium", v.title)}>{title}</h2>
        <p
          className={clsx("text-2xl font-semibold mt-1", v.value)}
          aria-live="polite"
        >
          {value}
        </p>
      </div>
    </article>
  );
}
