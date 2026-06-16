export const SkeletonPotCard = () => {
  return (
    <div
      role="status"
      aria-label="Loading pot information"
      aria-busy="true"
      className="flex flex-col bg-white px-5 py-6 rounded-md md:p-10"
    >
      <div className="flex flex-col w-full items-center gap-3">
        <div className="w-full h-[30px] rounded bg-gray-200 animate-pulse" />
        <div className="w-full h-[130px] rounded bg-gray-200 animate-pulse" />
        <div className="flex gap-3 w-full">
          <div className="w-full h-[30px] rounded bg-gray-200 animate-pulse" />
          <div className="w-full h-[30px] rounded bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
