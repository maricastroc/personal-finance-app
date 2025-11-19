interface PageTitleProps {
  title: string
}

export const PageTitle = ({ title }: PageTitleProps) => {
  return <h1 className="text-gray-900 font-bold text-3xl">{title}</h1>
}
