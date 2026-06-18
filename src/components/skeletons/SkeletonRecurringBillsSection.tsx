const SkeletonBillCard = ({ height = "5rem" }: { height?: string }) => (
  <div
    className="flex flex-col items-start justify-center gap-2 w-full p-4 rounded-lg bg-surface-700 border border-surface-500"
    style={{ height }}
  >
    <div className="w-full h-5 rounded bg-surface-600 animate-pulse" />
  </div>
);

export const SkeletonRecurringBillsSection = () => {
  return (
    <div className="flex flex-col w-full gap-4">
      <SkeletonBillCard height="5rem" />
      <SkeletonBillCard height="5rem" />
      <SkeletonBillCard height="6rem" />
    </div>
  );
};
