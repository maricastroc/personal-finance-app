export const SkeletonBudgetCard = () => {
  return (
    <div
      role="status"
      aria-label="Loading budget information"
      className="flex flex-col px-5 py-6 rounded-xl md:p-10"
      style={{
        background: "var(--card-gradient)",
        border: "1px solid var(--card-border)",
      }}
    >
      <div className="flex flex-col w-full items-center gap-4">
        <div
          aria-hidden="true"
          className="w-full h-[30px] rounded bg-surface-600 animate-pulse"
        />
        <div
          aria-hidden="true"
          className="w-full h-[30px] rounded bg-surface-600 animate-pulse"
        />
        <div
          aria-hidden="true"
          className="w-full h-[180px] rounded bg-surface-600 animate-pulse"
        />
      </div>
    </div>
  );
};
