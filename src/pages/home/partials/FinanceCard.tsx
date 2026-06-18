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
    label: "text-white/50",
    value: "text-white",
    accent: "",
    glow: "0 0 40px rgba(77, 173, 168, 0.08)",
    dark: true,
  },
  income: {
    label: "text-ink-300",
    value: "text-accent-green",
    accent: "border-l-2 border-l-accent-green",
    glow: "0 0 24px var(--glow-green)",
    dark: false,
  },
  outcome: {
    label: "text-ink-300",
    value: "text-accent-red",
    accent: "border-l-2 border-l-accent-red",
    glow: "0 0 24px var(--glow-red)",
    dark: false,
  },
  secondary: {
    label: "text-ink-300",
    value: "text-ink-50",
    accent: "",
    glow: undefined as string | undefined,
    dark: false,
  },
  tertiary: {
    label: "text-ink-300",
    value: "text-ink-50",
    accent: "",
    glow: undefined as string | undefined,
    dark: false,
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
        "flex items-center gap-4 h-full w-full px-6 py-5 rounded-xl md:h-32 lg:h-[7.4rem]",
        v.accent
      )}
      style={{
        background: v.dark
          ? "linear-gradient(145deg, #16161a 0%, #0e0e11 100%)"
          : "var(--card-gradient)",
        border: v.dark
          ? "1px solid rgba(255,255,255,0.10)"
          : "1px solid var(--card-border)",
        boxShadow: v.glow,
      }}
    >
      {icon && (
        <div className="shrink-0 opacity-60" aria-hidden="true">
          {icon}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <p
          className={clsx(
            "text-[10px] font-medium uppercase tracking-[0.14em]",
            v.label
          )}
        >
          {title}
        </p>
        <p
          className={clsx(
            "text-2xl font-semibold tracking-tight leading-none mt-1",
            v.value
          )}
          aria-live="polite"
        >
          {value}
        </p>
      </div>
    </article>
  );
}
