import { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isSubmitting?: boolean
  customContent?: string | null
  customContentLoading?: string | null
  variant?: 'default' | 'outline'
}

export const CustomButton = ({
  isSubmitting = false,
  customContent = null,
  customContentLoading = null,
  variant = 'default',
  ...props
}: CustomButtonProps) => {
  const baseClasses =
    'w-full font-semibold rounded-md p-3 items-center flex gap-2 transition-all duration-300 max-h-[60px] capitalize justify-center mt-8 disabled:cursor-not-allowed'

  const variantClasses = {
    default:
      'bg-gray-900 text-beige-100 hover:bg-gray-500 disabled:bg-gray-400 disabled:text-gray-100',
    outline:
      'border border-black text-black bg-transparent hover:bg-gray-500 hover:border-transparent hover:text-white disabled:border-gray-400 disabled:text-gray-400',
  }

  return (
    <button
      type="submit"
      disabled={isSubmitting || props.disabled}
      className={clsx(baseClasses, variantClasses[variant])}
      {...props}
    >
      {isSubmitting
        ? customContentLoading || 'Saving...'
        : customContent || 'Save changes'}
    </button>
  )
}
