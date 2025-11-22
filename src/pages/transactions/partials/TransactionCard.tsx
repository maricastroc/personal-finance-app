import { AVATAR_URL_DEFAULT } from "@/utils/constants";
import { Pencil, Trash } from "phosphor-react";

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
  date,
  value,
  balance,
  category,
  onEdit,
  onDelete,
}: TransactionCardProps) {
  return (
    <article
      className="flex justify-between w-full items-center py-4"
      aria-label={`Transação de ${name}`}
    >
      {/* Avatar + Nome */}
      <div className="flex items-center gap-2 md:w-[13rem] flex-1">
        <span className="relative w-11 h-11 rounded-full">
          <img
            src={avatarUrl || AVATAR_URL_DEFAULT}
            alt={`Avatar de ${name}`}
            className="rounded-full"
          />
        </span>

        <div className="flex flex-col gap-1 items-start pl-2 text-start flex-1">
          <p className="text-grey-900 font-bold text-sm">{name}</p>

          {category && (
            <p className="text-grey-500 text-xs md:hidden">{category}</p>
          )}
        </div>
      </div>

      {/* Valor + Data */}
      <div className="flex flex-col md:hidden gap-1 items-end pl-2 text-end">
        <p
          className={`font-bold text-sm ${
            balance === "income" ? "text-secondary-green" : "text-grey-900"
          }`}
          aria-label={
            balance === "income" ? `Entrada de ${value}` : `Saída de ${value}`
          }
        >
          {balance === "income" ? "+" : "-"} {value}
        </p>

        <time className="text-grey-500 text-xs" dateTime={date}>
          {date}
        </time>
      </div>

      {/* Ações - Só aparece no mobile */}
      <div className="flex items-center gap-2 md:hidden ml-2">
        {/* Botão Editar */}
        {onEdit && (
          <button
            onClick={onEdit}
            aria-label={`Editar transação com ${name}`}
            className="p-1 text-white hover:bg-blue-50 rounded-full bg-secondary-green transition-colors"
            title="Editar transação"
          >
            <Pencil size={16} />
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            aria-label={`Deletar transação com ${name}`}
            className="p-1 text-grey-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Deletar transação"
          >
            <Trash size={16} />
          </button>
        )}
      </div>
    </article>
  );
}
