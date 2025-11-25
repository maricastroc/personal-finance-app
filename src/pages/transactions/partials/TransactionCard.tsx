import { AVATAR_URL_DEFAULT } from "@/utils/constants";

interface TransactionCardProps {
  name: string;
  avatarUrl: string | undefined | null;
  date: string;
  value: string;
  balance: "expense" | "income" | undefined;
  category?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function TransactionCard({
  avatarUrl,
  name,
  category,
}: TransactionCardProps) {
  return (
    <article
      className="flex justify-between w-full items-center py-4"
      aria-label={`${name} transaction`}
    >
      <div className="flex items-center gap-2 md:w-[13rem] flex-1">
        <span className="relative w-11 h-11 rounded-full">
          <img
            src={avatarUrl || AVATAR_URL_DEFAULT}
            alt={`${name} avatar`}
            className="rounded-full"
          />
        </span>

        <div className="flex flex-col gap-1 items-start pl-2 text-start flex-1">
          <p className="text-grey-900 font-bold text-sm">{name}</p>

          {category && <p className="text-grey-500 text-xs">{category}</p>}
        </div>
      </div>
    </article>
  );
}
