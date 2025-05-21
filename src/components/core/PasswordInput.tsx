import { useState } from 'react'
import { Eye, EyeSlash } from 'phosphor-react'
import { ErrorMessage } from '../shared/ErrorMessage'

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export function PasswordInput({
  label,
  error,
  className = '',
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

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
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          className={`text-sm w-full h-12 rounded-md border border-beige-500 px-3 pr-10`}
          {...props}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <Eye className="h-5 w-5" />
          ) : (
            <EyeSlash className="h-5 w-5" />
          )}
        </button>
      </div>
      {error && <ErrorMessage message={error} />}
    </div>
  )
}
