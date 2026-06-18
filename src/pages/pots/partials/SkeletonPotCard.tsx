export const SkeletonPotCard = () => {
  return (
    <div
      role="status"
      aria-label="Loading pot information"
      aria-busy="true"
      className="flex flex-col px-5 py-6 rounded-xl md:p-10"
      style={{
        background: "var(--card-gradient)",
        border: "1px solid var(--card-border)",
      }}
    >
      <div className="flex flex-col w-full items-center gap-3">
        <div className="w-full h-[30px] rounded bg-surface-600 animate-pulse" />
        <div className="w-full h-[130px] rounded bg-surface-600 animate-pulse" />
        <div className="flex gap-3 w-full">
          <div className="w-full h-[30px] rounded bg-surface-600 animate-pulse" />
          <div className="w-full h-[30px] rounded bg-surface-600 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
