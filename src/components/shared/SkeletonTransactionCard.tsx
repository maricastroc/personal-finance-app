import { Skeleton } from '@mui/material'

export const SkeletonTransactionCard = () => {
  return (
    <div className="flex w-full justify-between items-center py-4">
      <div className="flex w-full items-center gap-3">
        <span className="relative w-11 h-11 rounded-full">
          <Skeleton variant="circular" width={'100%'} height={'100%'} />
        </span>
        <Skeleton variant="rounded" width={'100%'} height={16} />
      </div>
    </div>
  )
}
