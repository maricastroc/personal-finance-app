import { format, startOfMonth, subMonths, startOfYear } from "date-fns";
import { MonthPicker } from "@/components/shared/MonthPicker";

export type Period = {
  from: string; // ISO date string YYYY-MM-DD
  to: string;
};

type Preset = { label: string; key: string; period: Period };

function isoMonth(d: Date) {
  return format(d, "yyyy-MM-dd");
}

const now = new Date();

export const PRESETS: Preset[] = [
  {
    label: "3 months",
    key: "3m",
    period: {
      from: isoMonth(startOfMonth(subMonths(now, 2))),
      to: isoMonth(now),
    },
  },
  {
    label: "6 months",
    key: "6m",
    period: {
      from: isoMonth(startOfMonth(subMonths(now, 5))),
      to: isoMonth(now),
    },
  },
  {
    label: "This year",
    key: "1y",
    period: { from: isoMonth(startOfYear(now)), to: isoMonth(now) },
  },
];

export const DEFAULT_PERIOD = PRESETS[1].period;

type Props = {
  activeKey: string;
  customFrom: string;
  customTo: string;
  onPreset: (key: string, period: Period) => void;
  onCustomChange: (from: string, to: string) => void;
};

export function PeriodSelector({
  activeKey,
  customFrom,
  customTo,
  onPreset,
  onCustomChange,
}: Props) {
  const isCustom = activeKey === "custom";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {PRESETS.map((p) => (
        <button
          key={p.key}
          onClick={() => onPreset(p.key, p.period)}
          className={`
            px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150
            focus:outline-2 focus:outline-accent-green focus:outline-offset-1
            ${
              activeKey === p.key
                ? "bg-accent-green text-surface-900"
                : "bg-surface-600 text-ink-200 hover:bg-surface-500"
            }
          `}
        >
          {p.label}
        </button>
      ))}

      <button
        onClick={() => onPreset("custom", { from: customFrom, to: customTo })}
        className={`
          px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150
          focus:outline-2 focus:outline-accent-green focus:outline-offset-1
          ${
            isCustom
              ? "bg-accent-green text-surface-900"
              : "bg-surface-600 text-ink-200 hover:bg-surface-500"
          }
        `}
      >
        Custom
      </button>

      {isCustom && (
        <div className="flex items-center gap-2 mt-1 w-full sm:w-auto sm:mt-0">
          <MonthPicker
            value={customFrom.slice(0, 7)}
            max={customTo.slice(0, 7)}
            onChange={(v) => onCustomChange(v + "-01", customTo)}
          />
          <span className="text-ink-300 text-xs">→</span>
          <MonthPicker
            value={customTo.slice(0, 7)}
            min={customFrom.slice(0, 7)}
            max={format(now, "yyyy-MM")}
            onChange={(v) => onCustomChange(customFrom, v + "-01")}
          />
        </div>
      )}
    </div>
  );
}
