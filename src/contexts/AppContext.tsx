import { ThemeProps } from "@/types/theme";
import useRequest from "@/utils/useRequest";
import React, { createContext, useContext, useState, useMemo } from "react";

interface AppContextType {
  isSidebarOpen: boolean;
  handleIsSidebarOpen: (value: boolean) => void;
  themes: ThemeProps[] | undefined;
  isValidatingThemes: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleIsSidebarOpen = (value: boolean) => {
    setIsSidebarOpen(value);
  };

  const { data: themes, isValidating: isValidatingThemes } = useRequest<
    ThemeProps[]
  >(
    {
      url: "/themes",
      method: "GET",
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      keepPreviousData: true,
    }
  );

  const contextValue = useMemo(
    () => ({
      isSidebarOpen,
      handleIsSidebarOpen,
      themes,
      isValidatingThemes,
    }),
    [isSidebarOpen, themes, isValidatingThemes]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
};
