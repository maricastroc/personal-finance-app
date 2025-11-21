import { SkeletonTransactionsSection } from "@/components/skeletons/SkeletonTransactionsSection";
import { TransactionProps } from "@/types/transaction";
import HomeCard from "./HomeCard";
import { TransactionCard } from "@/components/shared/TransactionCard";
import { formatToDollar } from "@/utils/formatToDollar";
import { EmptyContent } from "@/components/shared/EmptyContent";
import { format } from "date-fns";
import { useRouter } from "next/router";

interface TransactionsSectionProps {
  isValidating: boolean;
  transactions: TransactionProps[] | undefined;
}

export const TransactionsSection = ({
  isValidating,
  transactions,
}: TransactionsSectionProps) => {
  const router = useRouter();

  return (
    <HomeCard
      routePath="/transactions"
      title="Transactions"
      buttonLabel="View All"
    >
      {isValidating ? (
        <SkeletonTransactionsSection />
      ) : (
        <div>
          {transactions && transactions?.length ? (
            transactions.map((transaction, index) => (
              <TransactionCard
                key={index}
                name={transaction.contactName}
                balance={transaction.balance}
                avatarUrl={transaction.contactAvatar}
                date={format(transaction.date, "MMM dd, yyyy")}
                value={formatToDollar(transaction.amount || 0)}
              />
            ))
          ) : (
            <EmptyContent
              content="No transactions yet!"
              description="Add transactions to track your spending and manage your finances effectively."
              icon={
                <img
                  src="/assets/images/icon-nav-transactions.svg"
                  alt="Pot icon"
                  className="w-12 h-12"
                />
              }
              buttonLabel="Manage Transactions"
              onButtonClick={() => {
                router.push("/transactions");
              }}
            />
          )}
        </div>
      )}
    </HomeCard>
  );
};
