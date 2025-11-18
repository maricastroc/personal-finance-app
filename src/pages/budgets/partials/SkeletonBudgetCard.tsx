import { Skeleton } from '@mui/material'

export const SkeletonBudgetCard = () => {
  return (
    <div
      role="status"
      aria-label="Loading budget information"
      className="flex flex-col bg-white px-5 py-6 rounded-md md:p-10"
    >
      <div className="flex flex-col w-full items-center gap-4">
        <Skeleton
          aria-hidden="true"
          variant="rounded"
          width="100%"
          height={30}
        />

        <Skeleton
          aria-hidden="true"
          variant="rounded"
          width="100%"
          height={30}
        />

        <Skeleton
          aria-hidden="true"
          variant="rounded"
          width="100%"
          height={180}
        />
      </div>
    </div>
  )
}
