const SkeletonBillCard = ({ height = "5rem" }: { height?: string }) => (
  <div
    className="flex flex-col items-start justify-center gap-2 w-full p-4 rounded-lg bg-beige-100"
    style={{ height }}
  >
    <div className="w-full h-6 rounded bg-gray-200 animate-pulse" />
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
