// contexts/BalanceContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import useRequest from "@/utils/useRequest";

interface BalanceContextType {
  currentBalance: number;
  incomes: number;
  expenses: number;
  isLoading: boolean;
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

  const { data, isValidating, mutate } = useRequest<{
    currentBalance: number;
    incomes: number;
    expenses: number;
  }>({ url: "/balance", method: "GET" });

  useEffect(() => {
    if (data) {
      setLocalBalance(data);
    }
  }, [data]);

  const updateBalance = (newBalance: number) => {
    setLocalBalance((prev) => ({
      ...prev,
      currentBalance: newBalance,
    }));
  };

  const refetchBalance = async () => {
    await mutate();
  };

  return (
    <BalanceContext.Provider
      value={{
        currentBalance: localBalance.currentBalance,
        incomes: localBalance.incomes,
        expenses: localBalance.expenses,
        isLoading: isValidating,
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
