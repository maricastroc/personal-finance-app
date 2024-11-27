import { Skeleton } from '@mui/material'

export const SkeletonBudgetCard = () => {
  return (
    <div className="flex flex-col bg-white px-5 py-6 rounded-md md:p-10">
      <div className="flex flex-col w-full items-center gap-3">
        <span className="relative w-full rounded-full">
          <Skeleton variant="rounded" width={'100%'} height={30} />
        </span>
        <span className="relative w-full rounded-full">
          <Skeleton variant="rounded" width={'100%'} height={30} />
        </span>
        <span className="relative w-full rounded-full">
          <Skeleton variant="rounded" width={'100%'} height={180} />
        </span>
      </div>
    </div>
  )
}
