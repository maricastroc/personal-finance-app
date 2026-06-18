export const SkeletonFinanceCard = () => {
  return (
    <div className="flex flex-col items-start justify-center gap-2 h-full w-full p-4 rounded-lg md:h-32 lg:h-[7.4rem] bg-surface-800 border border-surface-600">
      <div className="w-[30%] h-5 rounded bg-surface-600 animate-pulse" />
      <div className="w-full h-6 rounded bg-surface-600 animate-pulse" />
    </div>
  );
};
