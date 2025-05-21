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
  ...props
}: InputBaseProps) {
  return (
    <div className={`flex flex-col ${containerClassName}`}>
      {label && (
        <label
          htmlFor={props.id}
          className="text-xs font-bold text-gray-500 mb-1"
        >
          {label}
        </label>
      )}
      <input
        className={`text-sm w-full h-12 rounded-md border border-beige-500 px-3 items-center ${className}`}
        {...props}
      />
      {error && <ErrorMessage message={error} />}
    </div>
  )
}
