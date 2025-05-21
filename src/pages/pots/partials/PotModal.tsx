import { CustomButton } from '@/components/core/CustomButton'
import { ErrorMessage } from '@/components/shared/ErrorMessage'
import { SelectTheme } from '@/components/shared/SelectTheme'
import { api } from '@/lib/axios'
import { getThemeOptions } from '@/utils/getThemeOptions'
import { handleApiError } from '@/utils/handleApiError'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

interface EditPotModalProps {
  onClose: () => void
  targetAmount?: number
  currentAmount?: number
  themeColor?: string
  potId?: string
  name?: string
  isEdit?: boolean
  onSubmitForm: () => Promise<void>
}

const potFormSchema = () =>
  z.object({
    name: z.string().min(3, { message: 'Name is required.' }),
    targetAmount: z
      .number({ invalid_type_error: 'Amount must be a number.' })
      .min(1, { message: 'Amount must be greater than zero.' }),
    currentAmount: z
      .number({ invalid_type_error: 'Amount must be a number.' })
      .optional(),
    themeColor: z.string().min(3, { message: 'Theme is required.' }),
  })

export type PotFormData = z.infer<ReturnType<typeof potFormSchema>>

export function PotModalForm({
  onClose,
  name,
  targetAmount,
  currentAmount,
  themeColor,
  potId,
  onSubmitForm,
  isEdit = false,
}: EditPotModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<PotFormData>({
    resolver: zodResolver(potFormSchema()),
    defaultValues: {
      name: isEdit ? name : '',
      targetAmount: isEdit ? targetAmount : 0,
      themeColor: isEdit ? themeColor : '',
      currentAmount: isEdit ? currentAmount : 0,
    },
  })

  const handleEditPot = async (data: PotFormData) => {
    try {
      const payload = {
        name: data.name,
        themeColor: data.themeColor,
        targetAmount: data.targetAmount,
        currentAmount: data.currentAmount,
      }

      const response = await api.put(`/pots/${potId}`, payload, {
        headers: { 'Content-Type': 'application/json' },
      })

      toast?.success(response.data.message)
      await onSubmitForm()
      reset()
      onClose()
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleCreatePot = async (data: PotFormData) => {
    try {
      const payload = {
        name: data.name,
        themeColor: data.themeColor,
        targetAmount: data.targetAmount,
      }

      const response = await api.post(`/pots/${potId}`, payload, {
        headers: { 'Content-Type': 'application/json' },
      })

      toast?.success(response.data.message)
      await onSubmitForm()
      reset()
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
        <Dialog.Close
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-gray-900 hover:text-gray-100 transition-all duration-300 text-gray-500  p-[0.1rem] rounded-full border border-gray-900"
        >
          <X size={16} alt="Close modal" />
        </Dialog.Close>

        <Dialog.Title className="text-xl font-semibold text-gray-900 mb-2 md:text-2xl">
          {isEdit ? 'Edit Pot' : 'Add New Pot'}
        </Dialog.Title>

        <Dialog.Description className="flex flex-col w-full">
          <p className="text-sm text-gray-600">
            {isEdit
              ? 'If your saving targets change, feel free to update your pots.'
              : 'Create a pot to set savings targets. These can help keep you on track as you save for special purchases.'}
          </p>

          <form
            className="mt-6"
            onSubmit={
              isEdit
                ? handleSubmit(handleEditPot)
                : handleSubmit(handleCreatePot)
            }
          >
            <div className="flex flex-col mt-2">
              <label className="text-xs font-bold text-gray-500 mb-1">
                Pot Name
              </label>
              <input
                type="text"
                id="name"
                className="text-sm w-full h-12 rounded-md border border-beige-500 px-3 items-center"
                placeholder="Name"
                {...register('name')}
              />
              {errors.name && <ErrorMessage message={errors.name.message} />}
            </div>

            <div className="flex flex-col mt-4">
              <label
                htmlFor="targetAmount"
                className="text-xs font-bold text-gray-500 mb-1"
              >
                Target Amount ($)
              </label>
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  id="targetAmount"
                  className="text-sm w-full h-12 rounded-md border border-beige-500 pl-[1.8rem] pr-3"
                  placeholder="Target Amount"
                  {...register('targetAmount', { valueAsNumber: true })}
                />
              </div>
              {errors.targetAmount && (
                <ErrorMessage message={errors.targetAmount.message} />
              )}
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-xs font-bold text-gray-500 mb-1">
                Theme Color
              </label>
              <SelectTheme
                defaultValue={themeColor}
                data={getThemeOptions}
                onSelect={(value: string) => setValue('themeColor', value)}
              />
              {errors.themeColor && (
                <ErrorMessage message={errors.themeColor.message} />
              )}
            </div>

            <CustomButton isSubmitting={isSubmitting} />
          </form>
        </Dialog.Description>
      </Dialog.Content>
    </Dialog.Portal>
  )
}
