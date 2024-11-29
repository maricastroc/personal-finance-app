import { useRouter } from 'next/router'
import { ReactNode } from 'react'

interface HomeCardProps {
  title: string
  buttonLabel: string
  children: ReactNode
  flexGrow?: boolean
  routePath: string
}

export default function HomeCard({
  title,
  buttonLabel,
  children,
  routePath,
  flexGrow = false,
}: HomeCardProps) {
  const router = useRouter()

  return (
    <div
      className={`bg-white rounded-md grid gap-4 md:gap-5 mt-8 px-5 py-6 md:p-8 lg:mt-6 ${
        flexGrow && 'flex-grow'
      }`}
    >
      <div className={`flex justify-between ${flexGrow && 'h-8'}`}>
        <h2 className="font-bold text-xl">{title}</h2>
        <button
          className="flex items-center gap-2"
          onClick={() => router.push(routePath)}
        >
          <p className="text-sm text-gray-500">{buttonLabel}</p>
          <div className="relative h-3 w-3">
            <img src="/assets/images/icon-caret-right.svg" alt="" />
          </div>
        </button>
      </div>
      {children}
    </div>
  )
}
