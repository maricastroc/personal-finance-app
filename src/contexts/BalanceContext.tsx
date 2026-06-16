import React, { createContext, useContext, useState } from "react";
import { useSession } from "next-auth/react";
import useRequest from "@/utils/useRequest";
import { TransactionProps } from "@/types/transaction";
import { swrConfig } from "@/utils/constants";

interface BalanceContextType {
  currentBalance: number;
  incomes: number;
  expenses: number;
  isLoading: boolean;
  latestTransactions: TransactionProps[] | undefined;
  updateBalance: (newBalance: number) => void;
  refetchBalance: () => Promise<void>;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export function BalanceProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const [localBalance, setLocalBalance] = useState<number | null>(null);

  const {
    data: balanceData,
    isValidating: isValidatingBalance,
    mutate: mutateBalance,
  } = useRequest<{
    currentBalance: number;
    incomes: number;
    expenses: number;
  }>(isAuthenticated ? { url: "/balance", method: "GET" } : null, swrConfig);

  const {
    data: latestTransactions,
    mutate: mutateTransactions,
    isValidating: isValidatingTransactions,
  } = useRequest<TransactionProps[]>(
    isAuthenticated ? { url: "/transactions/latest", method: "GET" } : null,
    swrConfig
  );

  const isLoading =
    status === "loading" ||
    (isAuthenticated &&
      ((balanceData === undefined && isValidatingBalance) ||
        (latestTransactions === undefined && isValidatingTransactions)));

  const updateBalance = (newBalance: number) => {
    setLocalBalance(newBalance);
  };

  const refetchBalance = async () => {
    setLocalBalance(null);
    await Promise.all([mutateBalance(), mutateTransactions()]);
  };

  return (
    <BalanceContext.Provider
      value={{
        latestTransactions,
        currentBalance: localBalance ?? balanceData?.currentBalance ?? 0,
        incomes: balanceData?.incomes ?? 0,
        expenses: balanceData?.expenses ?? 0,
        isLoading,
        updateBalance,
        refetchBalance,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error("useBalance must be used within a BalanceProvider");
  }
  return context;
}
