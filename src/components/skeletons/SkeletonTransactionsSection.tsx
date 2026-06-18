const SkeletonTransactionItem = () => (
  <div className="flex items-center w-full py-3 border-b border-surface-600">
    <div className="w-10 h-10 rounded-full bg-surface-600 animate-pulse shrink-0" />
    <div className="flex flex-col ml-4 w-full gap-2">
      <div className="w-1/2 h-4 rounded bg-surface-600 animate-pulse" />
      <div className="w-1/3 h-3 rounded bg-surface-600 animate-pulse" />
    </div>
  </div>
);

export const SkeletonTransactionsSection = () => {
  return (
    <div className="flex flex-col w-full">
      {[...Array(6)].map((_, index) => (
        <SkeletonTransactionItem key={index} />
      ))}
    </div>
  );
};
