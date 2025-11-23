import { Skeleton } from "@mui/material";

const SkeletonTransactionItem = () => (
  <div className="flex items-center w-full bg-white px-2 py-2 rounded-md">
    <Skeleton variant="circular" width={40} height={40} />

    <div className="flex flex-col ml-4 w-full">
      <Skeleton variant="text" width="100%" height={18} />
      <Skeleton variant="text" width="100%" height={16} className="mt-1" />
    </div>
  </div>
);

export const SkeletonTransactionsSection = () => {
  return (
    <div className="flex flex-col w-full gap-4">
      {[...Array(6)].map((_, index) => (
        <SkeletonTransactionItem key={index} />
      ))}
    </div>
  );
};
