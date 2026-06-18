import Link from "next/link";
import { ReactNode } from "react";
import clsx from "clsx";

interface HomeCardProps {
  title: string;
  buttonLabel: string;
  children: ReactNode;
  flexGrow?: boolean;
  routePath: string;
}

export default function HomeCard({
  title,
  buttonLabel,
  children,
  routePath,
  flexGrow = false,
}: HomeCardProps) {
  return (
    <div
      className={clsx("rounded-xl mt-4 px-6 py-6 md:p-8 lg:mt-4", {
        "flex-grow": flexGrow,
      })}
      style={{
        background: "var(--card-gradient)",
        border: "1px solid var(--card-border)",
      }}
    >
      <div
        className={clsx("flex justify-between items-center mb-6", {
          "h-8": flexGrow,
        })}
      >
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-300">
          {title}
        </h2>

        <Link
          href={routePath}
          aria-label={`Go to ${title} details`}
          className="flex items-center gap-1.5 group focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-surface-800 rounded"
        >
          <p className="text-[11px] font-medium text-ink-400 group-hover:text-ink-100 transition-colors tracking-wide">
            {buttonLabel}
          </p>
          <img
            src="/assets/images/icon-caret-right.svg"
            alt=""
            aria-hidden="true"
            className="h-2.5 w-2.5 opacity-50 group-hover:opacity-100 transition-opacity"
          />
        </Link>
      </div>

      {children}
    </div>
  );
}
