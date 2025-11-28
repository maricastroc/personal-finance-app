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

  const [balanceLoaded, setBalanceLoaded] = useState(false);

  const [transactionsLoaded, setTransactionsLoaded] = useState(false);

  const {
    data: balanceData,
    isValidating: isValidatingBalance,
    mutate: mutateBalance,
  } = useRequest<{
    currentBalance: number;
    incomes: number;
    expenses: number;
  }>({ url: "/balance", method: "GET" }, swrConfig);

  const {
    data: latestTransactions,
    mutate: mutateTransactions,
    isValidating: isValidatingTransactions,
  } = useRequest<TransactionProps[]>(
    { url: "/transactions/latest", method: "GET" },
    swrConfig
  );

  useEffect(() => {
    if (balanceData) {
      setLocalBalance(balanceData);
      setBalanceLoaded(true);
    }
  }, [balanceData]);

  useEffect(() => {
    if (latestTransactions !== undefined) {
      setTransactionsLoaded(true);
    }
  }, [latestTransactions]);

  const isLoading = React.useMemo(() => {
    if (!balanceLoaded && !transactionsLoaded) {
      return true;
    }

    if (
      (isValidatingBalance || isValidatingTransactions) &&
      (balanceLoaded || transactionsLoaded)
    ) {
      return false;
    }

    return !balanceLoaded || !transactionsLoaded;
  }, [
    balanceLoaded,
    transactionsLoaded,
    isValidatingBalance,
    isValidatingTransactions,
  ]);

  const updateBalance = (newBalance: number) => {
    setLocalBalance((prev) => ({
      ...prev,
      currentBalance: newBalance,
    }));
  };

  const refetchBalance = async () => {
    if (!balanceData) setBalanceLoaded(false);
    if (!latestTransactions) setTransactionsLoaded(false);

    await Promise.all([mutateBalance(), mutateTransactions()]);
  };

  useEffect(() => {
    if (!balanceData) {
      setBalanceLoaded(false);
    }
    if (!latestTransactions) {
      setTransactionsLoaded(false);
    }
  }, [balanceData, latestTransactions]);

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
