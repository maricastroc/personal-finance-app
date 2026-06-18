import { ErrorMessage } from "../shared/ErrorMessage";

export type InputBaseProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  containerClassName?: string;
};

export function InputBase({
  label,
  error,
  containerClassName = "",
  className = "",
  id,
  required,
  ...props
}: InputBaseProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={`flex flex-col ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-bold text-ink-300 mb-1">
          {label}
        </label>
      )}

      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={errorId}
        required={required}
        className={`text-[16px] md:text-sm w-full h-12 rounded-lg border border-[var(--input-border)] bg-surface-700 text-ink-100 placeholder:text-ink-400 px-3 items-center focus:outline-none focus:border-accent-green/50 focus:shadow-[0_0_0_3px_var(--input-focus-glow)] transition-all duration-150 ${className}`}
        {...props}
      />

      {error && <ErrorMessage message={error} id={errorId} />}
    </div>
  );
}
