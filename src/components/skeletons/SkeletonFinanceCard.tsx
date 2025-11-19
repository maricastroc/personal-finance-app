import { Skeleton } from "@mui/material";

export const SkeletonFinanceCard = () => {
  return (
    <div
      className={`flex flex-col items-start justify-center gap-2 h-full w-full p-4 rounded-lg md:h-32 lg:h-[7.4rem] bg-white`}
    >
      <Skeleton variant="rounded" width={"30%"} height={24} />
      <Skeleton variant="rounded" width={"100%"} height={24} />
    </div>
  );
};
