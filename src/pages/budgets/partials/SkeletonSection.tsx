import { Skeleton } from "@mui/material";

export const SkeletonSection = () => {
  return Array.from({ length: 4 }).map((_, index) => (
    <div
      key={index}
      className="flex flex-col justify-start items-start w-full mt-5"
    >
      <span className="relative w-full rounded-full">
        <Skeleton variant="rounded" width={"100%"} height={20} />
      </span>

      {index !== 3 && <span className="my-4 w-full h-[1px] bg-grey-300" />}
    </div>
  ));
};
