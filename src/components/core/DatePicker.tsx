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
          w-full p-3 text-sm border rounded-md
          focus:outline-none focus:ring-2 focus:ring-secondary-green focus:ring-offset-2
          ${error ? "border-secondary-red" : "border-grey-500"}
          transition-colors
          text-grey-900
          [&::-webkit-calendar-picker-indicator]:opacity-60
          [&::-webkit-calendar-picker-indicator]:hover:opacity-100
          [&::-webkit-calendar-picker-indicator]:transition-opacity
          [&::-webkit-calendar-picker-indicator]:duration-200
        `}
      />
    </div>
  );
}
