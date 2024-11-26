interface BillCardProps {
  title: string
  value: string
  borderColor: string
}

export function BillCard({ title, value, borderColor }: BillCardProps) {
  return (
    <div
      className={`w-full h-14 rounded-lg border-l-4 px-4 flex items-center justify-between bg-beige-100 ${borderColor}`}
    >
      <p className="capitalize text-gray-500 text-sm">{title}</p>
      <p className="font-semibold text-sm">{value}</p>
    </div>
  )
}
