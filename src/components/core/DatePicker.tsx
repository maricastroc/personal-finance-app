interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  isEdit?: boolean;
  originalDate?: string;
}

export function DatePicker({
  value,
  onChange,
  error,
  isEdit = false,
  originalDate,
}: DatePickerProps) {
  const today = new Date();
  const todayLocal = today.toLocaleDateString("en-CA");

  const minDate = isEdit && originalDate ? undefined : todayLocal;

  return (
    <div className="relative">
      <input
        type="date"
        value={value}
        min={minDate}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full p-3 text-sm border rounded-lg bg-surface-700 text-ink-100
          focus:outline-2 focus:outline-accent-green focus:outline-offset-1
          ${error ? "border-accent-red" : "border-surface-600"}
          transition-colors
          [&::-webkit-calendar-picker-indicator]:opacity-60
          [&::-webkit-calendar-picker-indicator]:hover:opacity-100
          [&::-webkit-calendar-picker-indicator]:transition-opacity
          [&::-webkit-calendar-picker-indicator]:duration-200
        `}
      />
    </div>
  );
}
