interface EmptyContentProps {
  content: string
  variant?: 'primary' | 'secondary'
}

export const EmptyContent = ({
  content,
  variant = 'primary',
}: EmptyContentProps) => {
  return (
    <div
      className={`flex ${
        variant === 'primary' ? 'bg-beige-100' : 'bg-white'
      } items-center justify-center text-center gap-2 w-full p-4 rounded-lg h-32 lg:h-[7.4rem]`}
    >
      <p className={`text-sm w-full`}>{content}</p>
    </div>
  )
}
