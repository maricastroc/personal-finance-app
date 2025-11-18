import { Skeleton } from '@mui/material'

export const SkeletonTransactionCard = () => {
  return (
    <div
      className="flex w-full justify-between items-center py-4"
      aria-hidden="true"
    >
      <div className="flex w-full items-center gap-3">
        <div className="relative w-11 h-11 rounded-full overflow-hidden">
          <Skeleton variant="circular" width="100%" height="100%" />
        </div>

        <Skeleton
          variant="rounded"
          width="100%"
          height={16}
          className="flex-1"
        />
      </div>
    </div>
  )
}
