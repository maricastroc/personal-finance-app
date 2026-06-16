import { useScreenSize } from "@/utils/useScreenSize";

const SkeletonRow = () => (
  <div className="flex md:flex-col items-center gap-4 w-full">
    {[...Array(2)].map((_, i) => (
      <span key={i} className="relative w-full">
        <div className="w-full h-[50px] rounded bg-gray-200 animate-pulse" />
      </span>
    ))}
  </div>
);

export const SkeletonBudgetSection = () => {
  const isMobile = useScreenSize(768);
  const size = isMobile ? 190 : 240;

  return (
    <div className="flex max-h-[30rem] flex-col bg-white justify-center gap-6 items-center px-5 py-6 rounded-md md:gap-4 md:grid md:grid-cols-[2fr,1fr] md:p-10">
      <div
        className="rounded-full bg-gray-200 animate-pulse shrink-0"
        style={{ width: size, height: size }}
      />
      <div className="flex flex-col w-full items-center gap-4">
        <SkeletonRow />
        <SkeletonRow />
      </div>
    </div>
  );
};
