import clsx from "clsx";

interface BillCardProps {
  title: string;
  value: string;
  borderColor: "green" | "yellow" | "red";
}

const borderColors = {
  green: "border-l-accent-green",
  yellow: "border-l-accent-yellow",
  red: "border-l-accent-red",
};

export function BillCard({ title, value, borderColor }: BillCardProps) {
  return (
    <article
      aria-label={`${title}: ${value}`}
      className={clsx(
        "w-full py-4 px-4 border-l-2 flex items-center justify-between",
        borderColors[borderColor]
      )}
    >
      <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-ink-400">
        {title}
      </p>
      <p className="font-semibold text-sm text-ink-50" aria-live="polite">
        {value}
      </p>
    </article>
  );
}
