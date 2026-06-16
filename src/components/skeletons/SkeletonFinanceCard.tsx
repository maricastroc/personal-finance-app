export const SkeletonFinanceCard = () => {
  return (
    <div className="flex flex-col items-start justify-center gap-2 h-full w-full p-4 rounded-lg md:h-32 lg:h-[7.4rem] bg-white">
      <div className="w-[30%] h-6 rounded bg-gray-200 animate-pulse" />
      <div className="w-full h-6 rounded bg-gray-200 animate-pulse" />
    </div>
  );
};
