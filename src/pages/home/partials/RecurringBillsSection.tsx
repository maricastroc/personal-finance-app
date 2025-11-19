import HomeCard from "./HomeCard";
import { EmptyContent } from "@/components/shared/EmptyContent";
import { SkeletonRecurringBillsSection } from "@/components/skeletons/SkeletonRecurringBillsSection";
import { BillCard } from "./BillCard";
import { formatToDollar } from "@/utils/formatToDollar";
import { RecurringBillsResult } from "..";

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
      ) : recurringBills ? (
        <div className="flex flex-grow flex-col sm:justify-end sm:items-end sm:w-full gap-4 pt-4">
          <BillCard
            title="Paid Bills"
            value={formatToDollar(recurringBills.paid.total || 0)}
            borderColor="green"
          />
          <BillCard
            title="Total Upcoming"
            value={formatToDollar(recurringBills.upcoming.total || 0)}
            borderColor="yellow"
          />
          <BillCard
            title="Due Soon"
            value={formatToDollar(recurringBills.dueSoon.total || 0)}
            borderColor="cyan"
          />
        </div>
      ) : (
        <EmptyContent content="No recurring bills available." />
      )}
    </HomeCard>
  );
};
