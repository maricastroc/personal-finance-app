import { AVATAR_URL_DEFAULT } from "@/utils/constants";

interface RecurringBillProps {
  name: string;
  avatarUrl: string | undefined | null;
}

export function RecurringBillCard({ avatarUrl, name }: RecurringBillProps) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={avatarUrl || AVATAR_URL_DEFAULT}
        alt={`${name} logo`}
        className="w-9 h-9 rounded-full"
      />

      <span className="text-sm font-bold text-grey-900 truncate max-w-[10rem]">
        {name}
      </span>
    </div>
  );
}
