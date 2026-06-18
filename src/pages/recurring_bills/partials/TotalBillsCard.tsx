import { formatToDollar } from "@/utils/formatToDollar";
import Image from "next/image";
import iconRecurringBills from "/public/assets/images/icon-recurring-bills.svg";
import { RecurringBillsResult } from "@/types/recurring-bills-result";

interface TotalBillsCardProps {
  recurringBills: RecurringBillsResult | undefined;
}

export const TotalBillsCard = ({ recurringBills }: TotalBillsCardProps) => {
  return (
    <section
      aria-labelledby="total-bills-title"
      className="rounded-xl w-auto flex p-6 gap-6 md:flex-grow lg:flex-grow-0 md:flex-col md:pt-10 md:justify-between"
      style={{
        background: "linear-gradient(180deg, #131317 0%, #0e0e11 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Image
        src={iconRecurringBills}
        alt=""
        aria-hidden="true"
        width={32}
        className="opacity-60"
      />

      <div className="flex flex-col gap-1">
        <p
          id="total-bills-title"
          className="text-[10px] uppercase tracking-[0.1em] text-ink-300"
        >
          Total Bills
        </p>

        <h2 className="text-3xl text-ink-50 font-bold">
          {formatToDollar(recurringBills?.monthlyTotal || 0)}
        </h2>
      </div>
    </section>
  );
};
