import { useState } from "react";
import { Eye, EyeSlash } from "phosphor-react";
import { ErrorMessage } from "../shared/ErrorMessage";

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function PasswordInput({
  label,
  error,
  id,
  required,
  className = "",
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-bold text-grey-500 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          aria-invalid={!!error}
          aria-describedby={errorId}
          aria-required={required}
          required={required}
          className="text-sm w-full h-12 rounded-md border border-beige-500 px-3 pr-10
          focus:outline-none focus:ring-secondary-green focus:ring-2 focus:ring-offset-1"
          {...props}
        />

        <button
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          className="absolute inset-y-0 my-3 right-3 flex items-center text-grey-500
          focus:outline-secondary-green focus:outline-2 focus:outline-offset-1 rounded-sm"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? (
            <Eye className="h-5 w-5" />
          ) : (
            <EyeSlash className="h-5 w-5" />
          )}
        </button>
      </div>

      {error && <ErrorMessage message={error} id={errorId} />}
    </div>
  );
}
