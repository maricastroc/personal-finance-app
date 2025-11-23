interface Props {
  title: string;
  description?: string;
}

export const WarningSection = ({ title, description }: Props) => {
  return (
    <div className="mt-4 min-w-full flex flex-grow p-3 bg-secondary-green bg-opacity-10 rounded-md">
      <div className="flex items-start w-full gap-2">
        <div className="text-secondary-green mt-0.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
        <div className="text-secondary-green text-sm">
          <p className="font-medium">{title}</p>
          {description && <p className="mt-1">{description}</p>}
        </div>
      </div>
    </div>
  );
};
