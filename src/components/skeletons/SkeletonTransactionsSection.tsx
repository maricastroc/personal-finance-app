const SkeletonTransactionItem = () => (
  <div className="flex items-center w-full bg-white px-2 py-2 rounded-md">
    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse shrink-0" />
    <div className="flex flex-col ml-4 w-full gap-1">
      <div className="w-full h-[18px] rounded bg-gray-200 animate-pulse" />
      <div className="w-full h-4 rounded bg-gray-200 animate-pulse" />
    </div>
  </div>
);

export const SkeletonTransactionsSection = () => {
  return (
    <div className="flex flex-col w-full gap-4">
      {[...Array(6)].map((_, index) => (
        <SkeletonTransactionItem key={index} />
      ))}
    </div>
  );
};
