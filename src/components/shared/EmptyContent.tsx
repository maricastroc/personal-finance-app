import clsx from "clsx";

interface EmptyContentProps {
  content: string;
  variant?: "primary" | "secondary";
  className?: string;
}

export const EmptyContent = ({
  content,
  variant = "primary",
  className = "",
}: EmptyContentProps) => {
  if (!content) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        "flex items-center justify-center text-center gap-2 w-full p-4 rounded-lg min-h-32 lg:min-h-[7.4rem]",
        variant === "primary" ? "bg-beige-100" : "bg-white",
        className
      )}
    >
      <p className="text-sm w-full">{content}</p>
    </div>
  );
};
