// components/skeletons/SkeletonTransactionsSection.tsx
export const SkeletonSection = () => {
  return (
    <section className="mt-8 flex flex-col bg-white px-5 py-6 rounded-md md:p-10 animate-pulse">
      {/* Search Section Skeleton */}
      <div className="flex flex-col md:grid md:grid-cols-[1fr,2fr] lg:flex lg:flex-row lg:justify-between w-full gap-2 pb-6 md:gap-6">
        {/* Search Input Skeleton */}
        <div className="flex justify-between gap-3 items-center lg:w-full xl:max-w-[28rem]">
          <div className="h-10 bg-gray-200 rounded-md flex-grow"></div>
          <div className="md:hidden flex gap-2">
            <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
            <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
          </div>
        </div>

        {/* Filter Section Skeleton - Desktop */}
        <div className="hidden md:flex w-full gap-5 items-center md:justify-end">
          <div className="md:max-w-[13rem] lg:max-w-[16rem] w-full flex items-center gap-2">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-10 bg-gray-200 rounded-md flex-grow"></div>
          </div>
          <div className="md:min-w-[11rem] md:max-w-[13rem] lg:max-w-[16rem] w-full flex items-center gap-2">
            <div className="h-4 bg-gray-200 rounded w-12"></div>
            <div className="h-10 bg-gray-200 rounded-md flex-grow"></div>
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="flex overflow-x-auto mt-6">
        <table className="min-w-full table-fixed">
          <thead>
            <tr>
              {[...Array(5)].map((_, index) => (
                <th key={index} scope="col" className="px-4 py-2 text-left">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(6)].map((_, rowIndex) => (
              <tr key={rowIndex} className="border-t">
                {/* Recipient Column */}
                <td className="px-4 py-3 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex flex-col gap-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </td>

                {/* Category Column */}
                <td className="px-4 py-3 text-left">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </td>

                {/* Date Column */}
                <td className="px-4 py-3 text-left">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </td>

                {/* Amount Column */}
                <td className="px-4 py-3 text-right">
                  <div className="h-4 bg-gray-200 rounded w-12 ml-auto"></div>
                </td>

                {/* Actions Column */}
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between gap-2 mt-6">
        <div className="flex items-center gap-2">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-8 w-8 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    </section>
  );
};
