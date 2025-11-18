import clsx from 'clsx'

interface BillCardProps {
  title: string
  value: string
  borderColor: 'green' | 'yellow' | 'cyan'
}

const borderColors = {
  green: 'border-l-secondary-green',
  yellow: 'border-l-secondary-yellow',
  cyan: 'border-l-secondary-cyan',
}

export function BillCard({ title, value, borderColor }: BillCardProps) {
  return (
    <article
      aria-label={`${title}: ${value}`}
      className={clsx(
        'w-full h-14 rounded-lg border-l-4 px-4 flex items-center justify-between bg-beige-100',
        borderColors[borderColor],
      )}
    >
      <p className="capitalize text-gray-500 text-sm">{title}</p>

      <p className="font-semibold text-sm" aria-live="polite">
        {value}
      </p>
    </article>
  )
}
