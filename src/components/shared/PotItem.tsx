interface PotItemProps {
  title: string
  value: string
  color: string
}

export function PotItem({ title, value, color }: PotItemProps) {
  return (
    <div className="flex items-center w-full">
      <span className={`h-14 w-1 rounded-md ${color} mr-3`} />
      <div className="flex flex-col gap-4">
        <p className="text-gray-500 text-xs">{title}</p>
        <h2 className="text-sm font-bold text-gray-900">{value}</h2>
      </div>
    </div>
  )
}
