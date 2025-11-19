import clsx from 'clsx'
import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react'

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isSubmitting?: boolean
  children: ReactNode
  variant?: 'default' | 'outline'
  className?: string
}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  (
    {
      isSubmitting = false,
      children,
      variant = 'default',
      disabled,
      className,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      'w-full font-semibold rounded-md p-3 items-center flex gap-2 transition-all duration-300 max-h-[60px] capitalize justify-center mt-8 disabled:cursor-not-allowed focus:outline-offset-4 focus:outline-2 focus:outline-gray-900'

    const variantClasses = {
      default:
        'bg-gray-900 text-beige-100 hover:bg-gray-500 disabled:bg-gray-400 disabled:text-gray-100',
      outline:
        'border border-black text-black bg-transparent hover:bg-gray-500 hover:text-white hover:border-transparent disabled:border-gray-400 disabled:text-gray-400',
    }

    return (
      <button
        ref={ref}
        type={props.type ?? 'button'}
        aria-busy={isSubmitting}
        aria-live="polite"
        disabled={isSubmitting || disabled}
        className={clsx(baseClasses, variantClasses[variant], className)}
        {...props}
      >
        {isSubmitting ? 'Loading...' : children}
      </button>
    )
  },
)

PrimaryButton.displayName = 'PrimaryButton'
