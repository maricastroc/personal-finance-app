import { SkeletonPot } from "@/components/skeletons/SkeletonPot";
import { AllPotsProps } from "../index.page";
import HomeCard from "./HomeCard";
import { FinanceCard } from "./FinanceCard";
import { formatToDollar } from "@/utils/formatToDollar";
import { PotProps } from "@/types/pot";
import { FinanceItem } from "@/components/shared/FinanceItem";
import { EmptyContent } from "@/components/shared/EmptyContent";
import { useRouter } from "next/router";

interface PotsSectionProps {
  isValidating: boolean;
  allPots: AllPotsProps | undefined;
}

export const PotsSection = ({ isValidating, allPots }: PotsSectionProps) => {
  const router = useRouter();

  return (
    <HomeCard routePath="/pots" title="Pots" buttonLabel="See Details">
      {isValidating ? (
        <SkeletonPot />
      ) : allPots && allPots?.pots?.length ? (
        <div className="flex flex-col gap-5 md:grid md:grid-cols-2 lg:flex lg:flex-col">
          <FinanceCard
            icon={<img src="/assets/images/icon-pot.svg" alt="" />}
            variant="tertiary"
            title="Total saved"
            value={formatToDollar(allPots.totalCurrentAmount || 0)}
          />
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
        </div>
      ) : (
        <EmptyContent
          content="No pots yet!"
          description="Create pots to set money aside for specific goals or expenses."
          icon={
            <img
              src="/assets/images/icon-nav-pots.svg"
              alt="Pot icon"
              className="w-12 h-12"
            />
          }
          buttonLabel="Manage Pots"
          onButtonClick={() => {
            router.push("/pots");
          }}
        />
      )}
    </HomeCard>
  );
};
