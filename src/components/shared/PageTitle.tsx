interface PageTitleProps {
  title: string;
  description?: string;
}

export const PageTitle = ({ title, description }: PageTitleProps) => {
  return (
    <div className="flex flex-col items-start">
      <h1 className="text-grey-900 font-bold text-3xl">{title}</h1>
      {description && (
        <span className="hidden md:block text-sm text-grey-500">
          {description}
        </span>
      )}
    </div>
  );
};
