import { AVATAR_URL_DEFAULT } from "@/utils/constants";

interface TransactionCardProps {
  name: string;
  avatarUrl: string | undefined | null;
  date: string;
  value: string;
  balance: "expense" | "income" | undefined;
  category?: string;
}

export function TransactionCard({
  avatarUrl,
  name,
  date,
  value,
  balance,
  category,
}: TransactionCardProps) {
  return (
    <article
      className="flex justify-between w-full items-center py-4"
      aria-label={`Transação de ${name}`}
    >
      {/* Avatar + Nome */}
      <div className="flex items-center gap-2 md:w-[13rem]">
        <span className="relative w-11 h-11 rounded-full">
          <img
            src={avatarUrl || AVATAR_URL_DEFAULT}
            alt={`Avatar de ${name}`}
            className="rounded-full"
          />
        </span>

        <div className="flex flex-col gap-1 items-start pl-2 text-start">
          <p className="text-gray-900 font-bold text-sm">{name}</p>

          {category && (
            <p className="text-gray-500 text-xs md:hidden">{category}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col md:hidden gap-1 items-end pl-2 text-end">
        <p
          className={`font-bold text-sm ${
            balance === "income" ? "text-secondary-green" : "text-gray-900"
          }`}
          aria-label={
            balance === "income" ? `Entrada de ${value}` : `Saída de ${value}`
          }
        >
          {balance === "income" ? "+" : "-"} {value}
        </p>

        <time className="text-gray-500 text-xs" dateTime={date}>
          {date}
        </time>
      </div>
    </article>
  );
}
