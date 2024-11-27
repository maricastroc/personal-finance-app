import { ButtonHTMLAttributes } from 'react'

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isSubmitting?: boolean
  customContent?: string | null
  customContentLoading?: string | null
}

export const CustomButton = ({
  isSubmitting = false,
  customContent = null,
  customContentLoading = null,
  ...props
}: CustomButtonProps) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting || props.disabled}
      className="w-full font-semibold rounded-md p-3 items-center flex gap-2 transition-all duration-300 max-h-[60px] bg-gray-900 text-beige-100 hover:bg-gray-500 capitalize justify-center mt-8 disabled:bg-gray-400 disabled:text-gray-100 disabled:cursor-not-allowed"
      {...props}
    >
      {isSubmitting
        ? customContentLoading || 'Saving...'
        : customContent || 'Save changes'}
    </button>
  )
}
