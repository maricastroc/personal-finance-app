import { Skeleton } from '@mui/material'

export const SkeletonPotCard = () => {
  return (
    <div className="flex flex-col bg-white px-5 py-6 rounded-md md:p-10">
      <div className="flex flex-col w-full items-center gap-3">
        <span className="relative w-full rounded-full">
          <Skeleton variant="rounded" width={'100%'} height={30} />
        </span>
        <span className="relative w-full rounded-full">
          <Skeleton variant="rounded" width={'100%'} height={130} />
        </span>
        <div className="flex gap-3 w-full">
          <span className="relative w-full rounded-full">
            <Skeleton variant="rounded" width={'100%'} height={30} />
          </span>
          <span className="relative w-full rounded-full">
            <Skeleton variant="rounded" width={'100%'} height={30} />
          </span>
        </div>
      </div>
    </div>
  )
}
