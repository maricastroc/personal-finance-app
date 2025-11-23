import { useDebounce } from "@/utils/useDebounce";
import { MagnifyingGlass, X } from "phosphor-react";
import { useEffect, useState } from "react";

interface SearchInputProps {
  id?: string;
  label?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  debounceMs?: number;
}

export function SearchInput({
  id = "search",
  label = "Search",
  value,
  placeholder = "Search...",
  onChange,
  className = "",
  debounceMs = 300,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useDebounce(
    () => {
      onChange(internalValue);
    },
    debounceMs,
    [internalValue]
  );

  function handleClear() {
    setInternalValue("");
    onChange("");
  }

  return (
    <div
      className={`
        h-12 text-sm w-full flex items-center rounded-md border border-grey-500 px-1
        focus-within:ring-2 focus-within:ring-secondary-green 
        focus-within:ring-offset-2 
        transition-all duration-150
        ${className}
      `}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>

      <input
        id={id}
        type="text"
        value={internalValue}
        placeholder={placeholder}
        onChange={(e) => setInternalValue(e.target.value)}
        className="w-full px-3 py-3 bg-transparent outline-none"
      />

      {internalValue?.length > 0 ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={handleClear}
          className="mr-3 flex shrink-0"
        >
          <X aria-hidden="true" className="w-5 h-5" />
        </button>
      ) : (
        <MagnifyingGlass
          aria-hidden="true"
          className="mr-3 flex shrink-0 w-5 h-5"
        />
      )}
    </div>
  );
}
