import { api } from '@/lib/axios'
import { BudgetProps } from '@/types/budget'
import { handleApiError } from '@/utils/handleApiError'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'phosphor-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface DeleteBudgetModalProps {
  onClose: () => void
  budget: BudgetProps
  onSubmitForm: () => Promise<void>
}

export function DeleteBudgetModal({
  budget,
  onClose,
  onSubmitForm,
}: DeleteBudgetModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDeleteBudget = async () => {
    try {
      setIsSubmitting(true)

      const response = await api.delete(`/budgets/${budget.id}`)

      toast?.success(response.data.message)
      await onSubmitForm()
      onClose()
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay
        className="fixed inset-0 z-[990] bg-black bg-opacity-70"
        onClick={onClose}
      />

      <Dialog.Content className="fixed z-[999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] bg-white rounded-lg shadow-lg p-6 md:w-[560px] md:p-8">
        <Dialog.Close
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-gray-900 hover:text-gray-100 transition-all duration-300 text-gray-500  p-[0.1rem] rounded-full border border-gray-900"
        >
          <X size={16} alt="Close modal" />
        </Dialog.Close>

        <Dialog.Title className="text-xl font-semibold text-gray-900 mb-2 md:text-2xl">
          {`Delete ${budget.category.name} Budget`}
        </Dialog.Title>

        <Dialog.Description className="flex flex-col w-full">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this budget? This action cannot be
            reversed, and all the data inside it will be removed forever.
          </p>

          <div className="flex flex-col w-full gap-4 mt-10">
            <button
              disabled={isSubmitting}
              onClick={() => handleDeleteBudget()}
              className={`font-semibold rounded-md p-3 px-4 items-center flex gap-2 transition-all duration-300 max-h-[60px] text-sm bg-secondary-red text-beige-100 hover:brightness-125 capitalize justify-center disabled:bg-gray-400 disabled:text-gray-100 disabled:cursor-not-allowed`}
            >
              Yes, confirm deletion
            </button>
            <button
              disabled={isSubmitting}
              onClick={() => onClose()}
              className={`font-semibold rounded-md p-3 px-4 items-center flex gap-2 transition-all duration-300 max-h-[60px] text-sm bg-beige-100 text-gray-900 hover:brightness-90 capitalize justify-center disabled:bg-gray-400 disabled:text-gray-100 disabled:cursor-not-allowed`}
            >
              No, I want to go back
            </button>
          </div>
        </Dialog.Description>
      </Dialog.Content>
    </Dialog.Portal>
  )
}
