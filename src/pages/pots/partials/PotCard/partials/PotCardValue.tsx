import { formatToDollar } from "@/utils/formatToDollar";
import { PotProps } from "@/types/pot";

export function PotCardValue({ pot }: { pot: PotProps }) {
  return (
    <div className="mt-10 flex justify-between items-center">
      <p className="text-ink-300 text-xs uppercase tracking-[0.1em]">
        Total Saved
      </p>
      <h2 className="text-3xl font-bold text-ink-50">
        {formatToDollar(pot.currentAmount)}
      </h2>
    </div>
  );
}
