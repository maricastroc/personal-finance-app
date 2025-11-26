// contexts/BalanceContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
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
  const [localBalance, setLocalBalance] = useState({
    currentBalance: 0,
    incomes: 0,
    expenses: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  const {
    data,
    isValidating: isValidatingBalance,
    mutate,
  } = useRequest<{
    currentBalance: number;
    incomes: number;
    expenses: number;
  }>({ url: "/balance", method: "GET" });

  const {
    data: latestTransactions,
    mutate: mutateTransactions,
    isValidating: isValidatingTransactions,
  } = useRequest<TransactionProps[]>(
    { url: "/transactions/latest", method: "GET" },
    swrConfig
  );

  useEffect(() => {
    if (data) {
      setLocalBalance(data);
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    setIsLoading(isValidatingBalance || isValidatingTransactions);
  }, [isValidatingBalance, isValidatingTransactions]);

  const updateBalance = (newBalance: number) => {
    setLocalBalance((prev) => ({
      ...prev,
      currentBalance: newBalance,
    }));
  };

  const refetchBalance = async () => {
    await mutate();
    await mutateTransactions();
  };

  return (
    <BalanceContext.Provider
      value={{
        latestTransactions,
        currentBalance: localBalance.currentBalance,
        incomes: localBalance.incomes,
        expenses: localBalance.expenses,
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
