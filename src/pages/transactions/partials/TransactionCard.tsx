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

export function TransactionCard({ avatarUrl, name }: TransactionCardProps) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={avatarUrl || AVATAR_URL_DEFAULT}
        alt={`${name} avatar`}
        className="w-9 h-9 rounded-full shrink-0 object-cover"
      />
      <span className="text-sm font-medium text-ink-100 truncate">{name}</span>
    </div>
  );
}
