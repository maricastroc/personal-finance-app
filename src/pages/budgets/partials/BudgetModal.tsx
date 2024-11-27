import { CustomButton } from '@/components/shared/CustomButton'
import { ErrorMessage } from '@/components/shared/ErrorMessage'
import { SelectInput } from '@/components/shared/SelectInput'
import { api } from '@/lib/axios'
import { notyf } from '@/lib/notyf'
import { CategoryProps } from '@/types/category'
import { colors } from '@/utils/constants'
import { handleApiError } from '@/utils/handleApiError'
import useRequest from '@/utils/useRequest'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface EditBudgetModalProps {
  onClose: () => void
  categoryName?: string
  budgetLimit?: number
  theme?: string
  budgetId?: string
  isEdit?: boolean
  onSubmitForm: () => Promise<void>
}

const budgetFormSchema = () =>
  z.object({
    category: z.string().min(3, { message: 'Category is required.' }),
    budgetLimit: z
      .number({ invalid_type_error: 'Amount must be a number.' })
      .min(1, { message: 'Amount must be greater than zero.' }),
    theme: z.string().min(3, { message: 'Theme is required.' }),
  })

export type BudgetFormData = z.infer<ReturnType<typeof budgetFormSchema>>

const themeOptions = colors.map((color) => ({
  label: (
    <div className="flex items-center space-x-2">
      <span
        className="w-4 h-4 rounded-full"
        style={{ backgroundColor: color.hex }}
      ></span>
      <span>{color.name}</span>
    </div>
  ),
  value: color.hex,
}))

export function BudgetModalForm({
  onClose,
  categoryName,
  budgetLimit,
  theme,
  budgetId,
  onSubmitForm,
  isEdit = false,
}: EditBudgetModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetFormSchema()),
    defaultValues: {
      category: isEdit ? categoryName : '',
      budgetLimit,
      theme,
    },
  })

  const { data: categories } = useRequest<CategoryProps[]>({
    url: '/categories',
    method: 'GET',
  })

  const handleEditBudget = async (data: BudgetFormData) => {
    try {
      const payload = {
        categoryName: data.category,
        themeColor: data.theme,
        amount: data.budgetLimit,
      }

      const response = await api.put(`/budgets/${budgetId}`, payload, {
        headers: { 'Content-Type': 'application/json' },
      })

      notyf?.success(response.data.message)
      await onSubmitForm()
      onClose()
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleCreateBudget = async (data: BudgetFormData) => {
    try {
      const payload = {
        categoryName: data.category,
        themeColor: data.theme,
        amount: data.budgetLimit,
      }

      const response = await api.post(`/budgets/${budgetId}`, payload, {
        headers: { 'Content-Type': 'application/json' },
      })

      notyf?.success(response.data.message)
      await onSubmitForm()
      onClose()
    } catch (error) {
      handleApiError(error)
    }
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay
        className="fixed inset-0 z-[990] bg-black bg-opacity-70"
        onClick={onClose}
      />

      <Dialog.Content className="fixed z-[999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] bg-white rounded-lg shadow-lg p-6 md:w-[560px] md:p-8">
        <Dialog.Close className="absolute top-4 right-4 hover:bg-gray-900 hover:text-gray-100 transition-all duration-300 text-gray-500  p-[0.1rem] rounded-full border border-gray-900">
          <X size={16} alt="Close modal" />
        </Dialog.Close>

        <Dialog.Title className="text-xl font-semibold text-gray-900 mb-2 md:text-2xl">
          {isEdit ? 'Edit Budget' : 'Add New Budget'}
        </Dialog.Title>

        <Dialog.Description className="flex flex-col w-full">
          <p className="text-sm text-gray-600">
            {isEdit
              ? 'As your budgets change, feel free to update your spending limits.'
              : 'Choose a category to set a spending budget. These categories can help you monitor spending.'}
          </p>

          <form
            className="mt-6"
            onSubmit={
              isEdit
                ? handleSubmit(handleEditBudget)
                : handleSubmit(handleCreateBudget)
            }
          >
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 mb-1">
                Budget Category
              </label>
              {categories && (
                <SelectInput
                  defaultValue={categoryName}
                  data={categories}
                  onSelect={(value: string) => setValue('category', value)}
                  placeholder="Select a Category..."
                />
              )}
              {errors.category && (
                <ErrorMessage message={errors.category.message} />
              )}
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-xs font-bold text-gray-500 mb-1">
                Maximum Spend ($)
              </label>
              <input
                type="number"
                id="budgetLimit"
                className="text-sm w-full h-12 rounded-md border border-beige-500 px-3 items-center"
                placeholder="Maximum Spend"
                {...register('budgetLimit', { valueAsNumber: true })}
              />
              {errors.budgetLimit && (
                <ErrorMessage message={errors.budgetLimit.message} />
              )}
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-xs font-bold text-gray-500 mb-1">
                Theme Color
              </label>
              <SelectInput
                variant="secondary"
                defaultValue={theme}
                data={themeOptions}
                onSelect={(value: string) => setValue('theme', value)}
                placeholder="Select a Color..."
              />
              {errors.theme && <ErrorMessage message={errors.theme.message} />}
            </div>

            <CustomButton isSubmitting={isSubmitting} />
          </form>
        </Dialog.Description>
      </Dialog.Content>
    </Dialog.Portal>
  )
}
