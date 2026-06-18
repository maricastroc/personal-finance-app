export const SkeletonSection = () => {
  return Array.from({ length: 4 }).map((_, index) => (
    <div
      key={index}
      className="flex flex-col justify-start items-start w-full mt-5"
    >
      <div className="w-full h-5 rounded bg-surface-600 animate-pulse" />
      {index !== 3 && <span className="my-4 w-full h-[1px] bg-surface-600" />}
    </div>
  ));
};
