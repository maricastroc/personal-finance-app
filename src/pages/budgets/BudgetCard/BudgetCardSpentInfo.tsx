import { formatToDollar } from "@/utils/formatToDollar";

interface BudgetCardSpentInfoProps {
  spent: number;
  free: number;
}

export function BudgetCardSpentInfo({ spent, free }: BudgetCardSpentInfoProps) {
  return (
    <dl className="flex items-center mt-4 gap-4">
      <div className="flex items-center w-full">
        <span
          aria-hidden="true"
          className="w-1 h-10 rounded-md mr-3 bg-secondary-green"
        />

        <div>
          <dt className="text-xs text-grey-500">Spent</dt>
          <dd className="font-bold text-sm">{formatToDollar(spent)}</dd>
        </div>
      </div>

      <div className="flex items-center w-full">
        <span
          aria-hidden="true"
          className="w-1 h-10 rounded-md mr-3 bg-beige-100"
        />

        <div>
          <dt className="text-xs text-grey-500">Free</dt>
          <dd
            className={`font-bold text-sm ${free < 0 && "text-secondary-red"}`}
          >
            {formatToDollar(free)}
          </dd>
        </div>
      </div>
    </dl>
  );
}
