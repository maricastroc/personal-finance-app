export const SkeletonBudgetCard = () => {
  return (
    <div
      role="status"
      aria-label="Loading budget information"
      className="flex flex-col bg-white px-5 py-6 rounded-md md:p-10"
    >
      <div className="flex flex-col w-full items-center gap-4">
        <div aria-hidden="true" className="w-full h-[30px] rounded bg-gray-200 animate-pulse" />
        <div aria-hidden="true" className="w-full h-[30px] rounded bg-gray-200 animate-pulse" />
        <div aria-hidden="true" className="w-full h-[180px] rounded bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
};
