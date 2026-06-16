const SkeletonInfoBox = () => (
  <div className="flex flex-col items-start justify-center gap-2 h-full w-full p-4 rounded-lg md:h-32 lg:h-[7.4rem] bg-beige-100">
    <div className="w-[30%] h-6 rounded bg-gray-200 animate-pulse" />
    <div className="w-full h-6 rounded bg-gray-200 animate-pulse" />
  </div>
);

const SkeletonRow = () => (
  <div className="flex flex-col lg:flex-row items-center gap-5 w-full">
    {[...Array(2)].map((_, index) => (
      <div
        key={index}
        className="w-full h-[45px] rounded bg-gray-200 animate-pulse"
      />
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
