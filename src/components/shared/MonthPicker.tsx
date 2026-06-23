import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { format, parse } from "date-fns";

// value / onChange use "yyyy-MM" strings
type Props = {
  value: string; // "yyyy-MM"
  min?: string; // "yyyy-MM"
  max?: string; // "yyyy-MM"
  onChange: (value: string) => void;
  label?: string;
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function MonthPicker({ value, min, max, onChange, label }: Props) {
  const parsed = value ? parse(value, "yyyy-MM", new Date()) : new Date();
  const [year, setYear] = useState(parsed.getFullYear());
  const [open, setOpen] = useState(false);

  const selectedYear = parsed.getFullYear();
  const selectedMonth = parsed.getMonth();

  function isDisabled(m: number) {
    const ym = `${year}-${String(m + 1).padStart(2, "0")}`;
    if (min && ym < min) return true;
    if (max && ym > max) return true;
    return false;
  }

  function select(m: number) {
    if (isDisabled(m)) return;
    const newVal = `${year}-${String(m + 1).padStart(2, "0")}`;
    onChange(newVal);
    setOpen(false);
  }

  const displayLabel = value
    ? format(parse(value, "yyyy-MM", new Date()), "MMMM yyyy")
    : label ?? "Select month";

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className="
          flex items-center gap-1.5
          bg-surface-600 border border-[var(--card-border)] text-ink-100
          text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap
          hover:bg-surface-500 transition-colors
          focus:outline-2 focus:outline-accent-green focus:outline-offset-1
        "
        >
          <CalendarDays size={12} className="text-ink-300" />
          {displayLabel}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={6}
          align="start"
          className="z-50 rounded-xl p-3 w-52 shadow-[var(--shadow-dropdown)]"
          style={{
            background: "var(--surface-700)",
            border: "1px solid var(--card-border)",
          }}
        >
          {/* Year navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setYear((y) => y - 1)}
              className="p-1 rounded hover:bg-surface-600 text-ink-200 hover:text-ink-100 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs font-semibold text-ink-100">{year}</span>
            <button
              onClick={() => setYear((y) => y + 1)}
              className="p-1 rounded hover:bg-surface-600 text-ink-200 hover:text-ink-100 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-3 gap-1">
            {MONTHS.map((name, m) => {
              const disabled = isDisabled(m);
              const isSelected = year === selectedYear && m === selectedMonth;
              return (
                <button
                  key={name}
                  disabled={disabled}
                  onClick={() => select(m)}
                  className={`
                    py-1.5 rounded-lg text-xs font-medium transition-colors
                    ${
                      isSelected
                        ? "bg-accent-green text-surface-900"
                        : disabled
                        ? "text-ink-400 cursor-not-allowed"
                        : "text-ink-200 hover:bg-surface-600 hover:text-ink-100"
                    }
                  `}
                >
                  {name}
                </button>
              );
            })}
          </div>
          <Popover.Arrow style={{ fill: "var(--surface-700)" }} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
