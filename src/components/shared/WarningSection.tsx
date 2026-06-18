interface Props {
  title: string;
  description?: string;
}

export const WarningSection = ({ title, description }: Props) => {
  return (
    <div className="mt-4 min-w-full flex flex-grow px-4 py-3 border border-surface-500 rounded-md">
      <div className="flex items-start w-full gap-2">
        <div className="text-ink-300 mt-0.5 shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
        <div className="text-ink-300 text-xs leading-relaxed">
          <p>{title}</p>
          {description && <p className="mt-1">{description}</p>}
        </div>
      </div>
    </div>
  );
};
