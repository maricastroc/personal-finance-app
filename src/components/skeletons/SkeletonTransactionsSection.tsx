import { Skeleton } from "@mui/material";

const SkeletonTransactionItem = () => (
  <div className="flex items-center justify-center w-full bg-white">
    <Skeleton variant="rounded" width="100%" height={45} />
  </div>
);

export const SkeletonTransactionsSection = () => {
  return (
    <div className="flex flex-col w-full gap-5">
      {[...Array(6)].map((_, index) => (
        <SkeletonTransactionItem key={index} />
      ))}
    </div>
  );
};
