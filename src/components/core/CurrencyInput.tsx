import { useState, useCallback } from "react";
import { CurrencyDollar } from "phosphor-react";
import { InputBase } from "./InputBase";
import { ErrorMessage } from "../shared/ErrorMessage";

export type CurrencyInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  value?: number;
  onValueChange?: (value: number) => void;
  containerClassName?: string;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function parseCurrencyInput(value: string): number {
  const cleanValue = value.replace(/[^\d]/g, "");

  return parseFloat(cleanValue) / 100;
}

function formatDisplayValue(value: string): string {
  const cleanValue = value.replace(/[^\d]/g, "");

  if (!cleanValue) return "";

  const numericValue = parseFloat(cleanValue) / 100;
  return formatCurrency(numericValue);
}

export function CurrencyInput({
  value,
  onValueChange,
  label,
  error,
  id,
  required,
  className = "",
  containerClassName = "",
  ...props
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(
    value ? formatCurrency(value) : ""
  );

  const errorId = error ? `${id}-error` : undefined;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      if (inputValue === "") {
        setDisplayValue("");
        if (onValueChange) {
          onValueChange(0);
        }
        return;
      }

      const numericOnly = inputValue.replace(/[^\d]/g, "");

      if (numericOnly === "") {
        setDisplayValue("");
        if (onValueChange) {
          onValueChange(0);
        }
        return;
      }

      const formattedValue = formatDisplayValue(numericOnly);
      setDisplayValue(formattedValue);

      const numericValue = parseFloat(numericOnly) / 100;

      if (onValueChange) {
        onValueChange(numericValue);
      }
    },
    [onValueChange]
  );

  const handleBlur = useCallback(() => {
    if (displayValue) {
      const numericValue = parseCurrencyInput(displayValue);
      const formatted = formatCurrency(numericValue);
      setDisplayValue(formatted);

      if (onValueChange) {
        onValueChange(numericValue);
      }
    } else {
      setDisplayValue("");
      if (onValueChange) {
        onValueChange(0);
      }
    }
  }, [displayValue, onValueChange]);

  const handleFocus = useCallback(() => {
    if (displayValue) {
      const numericValue = parseCurrencyInput(displayValue);

      setDisplayValue(numericValue.toFixed(2));
    }
  }, [displayValue]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        !/[\d]/.test(e.key) &&
        ![
          "Backspace",
          "Delete",
          "Tab",
          "Escape",
          "Enter",
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "Home",
          "End",
        ].includes(e.key)
      ) {
        e.preventDefault();
      }
    },
    []
  );

  return (
    <div className={`flex flex-col ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-bold text-grey-500 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <CurrencyDollar className="h-5 w-5 text-grey-500" />
        </div>

        <InputBase
          {...props}
          id={id}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder="0.00"
          aria-invalid={!!error}
          aria-describedby={errorId}
          aria-required={required}
          required={required}
          className={`pl-10 ${className}`}
          error={error}
        />
      </div>

      {error && <ErrorMessage message={error} id={errorId} />}
    </div>
  );
}
