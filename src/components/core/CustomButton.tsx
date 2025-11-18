import clsx from 'clsx'
import React, { forwardRef, ButtonHTMLAttributes } from 'react'

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isSubmitting?: boolean
  customContent?: string | null
  customContentLoading?: string | null
  variant?: 'default' | 'outline'
}

export const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      isSubmitting = false,
      customContent = null,
      customContentLoading = null,
      variant = 'default',
      disabled,
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
        className={clsx(baseClasses, variantClasses[variant])}
        {...props}
      >
        {isSubmitting
          ? customContentLoading || 'Loading...'
          : customContent || 'Save changes'}
      </button>
    )
  },
)

CustomButton.displayName = 'CustomButton'
