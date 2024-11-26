interface EmptyContentProps {
  content: string
}

export const EmptyContent = ({ content }: EmptyContentProps) => {
  return (
    <div
      className={`flex bg-beige-100 items-center justify-center text-center gap-2 w-full p-4 rounded-lg h-32 lg:h-[7.4rem]`}
    >
      <p className={`text-sm w-full`}>{content}</p>
    </div>
  )
}
