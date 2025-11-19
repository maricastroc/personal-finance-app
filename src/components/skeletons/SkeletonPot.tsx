import { Skeleton } from "@mui/material";

const SkeletonInfoBox = () => (
  <div className="flex flex-col items-start justify-center gap-2 h-full w-full p-4 rounded-lg md:h-32 lg:h-[7.4rem] bg-beige-100">
    <Skeleton variant="rounded" width="30%" height={24} />
    <Skeleton variant="rounded" width="100%" height={24} />
  </div>
);

const SkeletonRow = () => (
  <div className="flex flex-col lg:flex-row items-center gap-5 w-full">
    {[...Array(2)].map((_, index) => (
      <Skeleton key={index} variant="rounded" width="100%" height={45} />
    ))}
  </div>
);

export const SkeletonPot = () => {
  return (
    <>
      <SkeletonInfoBox />
      <div className="flex flex-col gap-5 md:grid md:grid-cols-2 lg:flex lg:flex-col">
        <SkeletonRow />
        <SkeletonRow />
      </div>
    </>
  );
};
