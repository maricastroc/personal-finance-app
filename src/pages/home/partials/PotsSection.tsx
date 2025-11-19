import { SkeletonPot } from "@/components/skeletons/SkeletonPot";
import { AllPotsProps } from "..";
import HomeCard from "./HomeCard";
import { FinanceCard } from "./FinanceCard";
import { formatToDollar } from "@/utils/formatToDollar";
import { PotProps } from "@/types/pot";
import { FinanceItem } from "@/components/shared/FinanceItem";
import { EmptyContent } from "@/components/shared/EmptyContent";

interface PotsSectionProps {
  isValidating: boolean;
  allPots: AllPotsProps | undefined;
}

export const PotsSection = ({ isValidating, allPots }: PotsSectionProps) => {
  return (
    <HomeCard routePath="/pots" title="Pots" buttonLabel="See Details">
      <div className="flex flex-col gap-5 md:grid md:grid-cols-2 lg:flex lg:flex-col">
        {isValidating ? (
          <SkeletonPot />
        ) : allPots ? (
          <>
            <FinanceCard
              icon={<img src="/assets/images/icon-pot.svg" alt="" />}
              variant="tertiary"
              title="Total saved"
              value={formatToDollar(allPots.totalCurrentAmount || 0)}
            />
            {allPots.pots?.length ? (
              <div className="grid grid-cols-2 gap-4">
                {allPots.pots.map((pot: PotProps) => (
                  <FinanceItem
                    key={pot.id}
                    title={pot.name}
                    value={pot.currentAmount || 0}
                    color={pot.theme.color}
                  />
                ))}
              </div>
            ) : (
              <EmptyContent content="No pots available." />
            )}
          </>
        ) : (
          <EmptyContent content="No pots available." />
        )}
      </div>
    </HomeCard>
  );
};
