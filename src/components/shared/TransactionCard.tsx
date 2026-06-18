import { AVATAR_URL_DEFAULT } from "@/utils/constants";

interface TransactionCardProps {
  name: string;
  avatarUrl: string | undefined | null;
  date: string;
  value: string;
  balance?: "expense" | "income";
  category?: string;
  isBudgetsScreen?: boolean;
}

export function TransactionCard({
  avatarUrl,
  name,
  date,
  value,
  balance,
  category,
  isBudgetsScreen = false,
}: TransactionCardProps) {
  const isPlaceholder = !avatarUrl;
  const altText = isPlaceholder ? "" : `${name}'s avatar`;

  return (
    <div
      className={`flex justify-between items-center border-b border-surface-700 py-3.5 ${
        isBudgetsScreen ? "py-2.5" : ""
      }`}
    >
      <div
        className={`flex items-center gap-3 ${
          isBudgetsScreen ? "max-sm:gap-0" : ""
        }`}
      >
        <div
          className={`relative rounded-full overflow-hidden shrink-0 ${
            isBudgetsScreen
              ? "w-8 h-8 max-sm:w-7 max-sm:h-7 md:w-9 md:h-9"
              : "w-9 h-9"
          }`}
        >
          <img
            src={avatarUrl || AVATAR_URL_DEFAULT}
            alt={altText}
            aria-hidden={isPlaceholder ? "true" : undefined}
            className="rounded-full object-cover w-full h-full"
          />
        </div>

        <div className="flex flex-col gap-0.5 items-start text-start overflow-hidden">
          <p
            className={`text-ink-100 font-medium ${
              isBudgetsScreen
                ? "text-xs max-sm:truncate max-sm:whitespace-nowrap max-sm:max-w-[5rem] md:text-sm md:max-w-[12rem]"
                : "text-sm"
            }`}
          >
            {name}
          </p>

          {category && (
            <p className="text-[10px] uppercase tracking-[0.06em] text-ink-400 font-medium">
              {category}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-0.5 items-end pl-2">
        <p
          className={`font-semibold ${
            balance === "income" ? "text-accent-green" : "text-accent-red"
          } ${isBudgetsScreen ? "text-xs" : "text-sm"}`}
        >
          {balance === "income" ? "+" : "−"} {value}
        </p>
        <p className="text-[10px] text-ink-400 tracking-wide">{date}</p>
      </div>
    </div>
  );
}
