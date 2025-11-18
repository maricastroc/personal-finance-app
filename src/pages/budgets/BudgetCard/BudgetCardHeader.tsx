interface BudgetCardHeaderProps {
  categoryName: string
  theme: string
  isLoading: boolean
  children?: React.ReactNode
}

export function BudgetCardHeader({
  categoryName,
  theme,
  isLoading,
  children,
}: BudgetCardHeaderProps) {
  return (
    <header className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        {isLoading ? (
          <h2 className="text-xl font-bold" aria-busy="true">
            Loading...
          </h2>
        ) : (
          <>
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: theme }}
            />
            <h2 className="text-xl font-bold">{categoryName}</h2>
          </>
        )}
      </div>

      {children}
    </header>
  )
}
