interface PageTitleProps {
  title: string;
  description?: string;
}

export const PageTitle = ({ title, description }: PageTitleProps) => {
  return (
    <div className="flex flex-col items-start gap-1">
      <h1 className="text-2xl font-bold tracking-tight text-ink-50">{title}</h1>
      {description && (
        <span className="hidden md:block text-xs text-ink-300 mt-0.5">
          {description}
        </span>
      )}
    </div>
  );
};
