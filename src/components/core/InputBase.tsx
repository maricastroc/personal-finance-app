import { ErrorMessage } from '../shared/ErrorMessage'

export type InputBaseProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  containerClassName?: string
}

export function InputBase({
  label,
  error,
  containerClassName = '',
  className = '',
  id,
  required,
  ...props
}: InputBaseProps) {
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className={`flex flex-col ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-bold text-gray-500 mb-1">
          {label}
        </label>
      )}

      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={errorId}
        required={required}
        className={`text-sm w-full h-12 rounded-md border border-beige-500 px-3 focus:border-beige-500 items-center focus:outline-none focus:ring-gray-900 focus:ring-2 focus:ring-offset-2 ${className}`}
        {...props}
      />

      {error && <ErrorMessage message={error} id={errorId} />}
    </div>
  )
}
