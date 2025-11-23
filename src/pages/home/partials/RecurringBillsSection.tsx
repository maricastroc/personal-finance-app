import HomeCard from "./HomeCard";
import { EmptyContent } from "@/components/shared/EmptyContent";
import { SkeletonRecurringBillsSection } from "@/components/skeletons/SkeletonRecurringBillsSection";
import { BillCard } from "./BillCard";
import { formatToDollar } from "@/utils/formatToDollar";
import { RecurringBillsResult } from "../index.page";

interface RecurringBillsSectionProps {
  isValidating: boolean;
  recurringBills: RecurringBillsResult | undefined;
}

export const RecurringBillsSection = ({
  isValidating,
  recurringBills,
}: RecurringBillsSectionProps) => {
  return (
    <HomeCard
      routePath="/recurring_bills"
      title="Recurring Bills"
      buttonLabel="See Details"
    >
      {isValidating ? (
        <SkeletonRecurringBillsSection />
      ) : recurringBills && recurringBills?.bills?.length ? (
        <div className="flex flex-grow flex-col sm:justify-end sm:items-end sm:w-full gap-4 pt-4">
          <BillCard
            title="Total Upcoming"
            value={formatToDollar(recurringBills.upcoming.total || 0)}
            borderColor="green"
          />
          <BillCard
            title="Total Due Soon"
            value={formatToDollar(recurringBills.dueSoon.total || 0)}
            borderColor="yellow"
          />
          <BillCard
            title="Total Overdue"
            value={formatToDollar(recurringBills.overdue.total || 0)}
            borderColor="red"
          />
        </div>
      ) : (
        <EmptyContent
          content="No bills yet!"
          description="Recurring bills are driven by your transactions. Marking transactions as recurring bills will help you manage your upcoming expenses."
          icon={
            <img
              src="/assets/images/icon-nav-recurring-bills.svg"
              alt="Recurring Bill icon"
              className="w-12 h-12"
            />
          }
        />
      )}
    </HomeCard>
  );
};
