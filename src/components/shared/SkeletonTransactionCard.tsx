export const SkeletonTransactionCard = () => {
  return (
    <div
      className="flex w-full justify-between items-center py-4"
      aria-hidden="true"
    >
      <div className="flex w-full items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-gray-200 animate-pulse shrink-0" />
        <div className="flex-1 h-4 rounded bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
};
