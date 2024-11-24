import React, { createContext, useContext, useState, useMemo } from 'react'

interface AppContextType {
  isSidebarOpen: boolean
  handleIsSidebarOpen: (value: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleIsSidebarOpen = (value: boolean) => {
    setIsSidebarOpen(value)
  }

  const contextValue = useMemo(
    () => ({
      isSidebarOpen,
      handleIsSidebarOpen,
    }),
    [isSidebarOpen],
  )

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  )
}

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext)

  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }

  return context
}
