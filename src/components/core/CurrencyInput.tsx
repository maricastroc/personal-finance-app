import { ErrorMessage } from '../shared/ErrorMessage'

type CurrencyInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  currencySymbol?: string
  onChange?: (value: number) => void
  value?: number
}

export function CurrencyInput({
  label,
  error,
  currencySymbol = '$',
  className = '',
  onChange,
  value,
  ...props
}: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const numValue = parseFloat(rawValue) || 0
    onChange?.(numValue)
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label
          htmlFor={props.id}
          className="text-xs font-bold text-gray-500 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
          {currencySymbol}
        </span>
        <input
          type="number"
          step="0.01"
          className={`text-sm w-full h-12 rounded-md border border-beige-500 pl-[1.8rem] pr-3`}
          value={value ?? ''}
          onChange={handleChange}
          {...props}
        />
        {error && (
          <div className="absolute -bottom-6 left-0">
            <ErrorMessage message={error} />
          </div>
        )}
      </div>
    </div>
  )
}
