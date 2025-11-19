import { formatToDollar } from "@/utils/formatToDollar";
import { PotProps } from "@/types/pot";

export function PotCardValue({ pot }: { pot: PotProps }) {
  return (
    <div className="mt-10 flex justify-between items-center">
      <p className="text-gray-500 text-sm">Total Saved</p>
      <h2 className="text-3xl font-bold">
        {formatToDollar(pot.currentAmount)}
      </h2>
    </div>
  );
}
