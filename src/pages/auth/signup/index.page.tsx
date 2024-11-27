import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import AuthLayout from '../../../components/layouts/authLayout.page'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@/components/shared/ErrorMessage'
import { useRef, useState } from 'react'
import { AvatarInput } from '@/components/shared/AvatarInput'
import { api } from '@/lib/axios'
import { notyf } from '@/lib/notyf'
import { handleApiError } from '@/utils/handleApiError'
import { CustomButton } from '@/components/shared/CustomButton'
import { useRouter } from 'next/router'

const signUpFormSchema = z.object({
  email: z.string().min(3, { message: 'E-mail is required.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' }),
  initialBalance: z
    .string()
    .min(1, { message: 'Initial balance value is required.' }),
  name: z.string().min(3, { message: 'Name is required.' }),
  avatarUrl: z
    .custom<File>((file) => file instanceof File && file.size > 0)
    .optional(),
})

type SignUpFormData = z.infer<typeof signUpFormSchema>

export default function SignUp() {
  const isRouteLoading = useLoadingOnRouteChange()

  const inputFileRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: { email: '', password: '', name: '' },
  })

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setValue('avatarUrl', file)

      const reader = new FileReader()
      reader.onload = () => {
        setAvatarPreview(reader.result as string)
      }

      reader.readAsDataURL(file)
    }
  }

  async function handleSignUp(data: SignUpFormData) {
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('name', data.name)
    formData.append('initialBalance', data.initialBalance)
    formData.append('password', data.password)

    if (data.avatarUrl) formData.append('avatarUrl', data.avatarUrl)

    try {
      const response = await api.post(`/profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      notyf?.success(response.data.message)

      router.push('/auth/login')
    } catch (error) {
      handleApiError(error)
    }
  }

  return isRouteLoading ? (
    <LoadingPage />
  ) : (
    <AuthLayout>
      <div className="bg-white overflow-y-scroll relative mx-4 px-5 py-6 rounded-md w-full max-w-[500px] xl:w-full flex flex-col justify-start xl:mx-auto xl:max-h-[90vh]">
        <h2 className="font-bold text-2xl">Sign Up</h2>
        <form
          className="flex flex-col py-8 gap-4"
          onSubmit={handleSubmit(handleSignUp)}
        >
          <AvatarInput
            avatarPreview={avatarPreview}
            onChange={handleAvatarChange}
            inputFileRef={inputFileRef}
          />

          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="text-xs font-bold text-gray-500 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="text-sm w-full h-12 rounded-md border border-beige-500 px-3 items-center"
              placeholder="Your name here"
              {...register('name')}
            />
            {errors.name && <ErrorMessage message={errors.name.message} />}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-xs font-bold text-gray-500 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="text-sm w-full h-12 rounded-md border border-beige-500 px-3 items-center"
              placeholder="Your email here"
              {...register('email')}
            />
            {errors.email && <ErrorMessage message={errors.email.message} />}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="initialBalance"
              className="text-xs font-bold text-gray-500 mb-1"
            >
              Initial Balance ($)
            </label>
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                $
              </span>
              <input
                type="number"
                id="initialBalance"
                className="text-sm w-full h-12 rounded-md border border-beige-500 pl-[1.8rem] pr-3"
                placeholder="Initial Balance"
                {...register('initialBalance', { valueAsNumber: true })}
              />
              {errors.initialBalance && (
                <ErrorMessage message={errors.initialBalance.message} />
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-xs font-bold text-gray-500 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="text-sm w-full h-12 rounded-md border border-beige-500 px-3 items-center"
              placeholder="Password"
              {...register('password')}
            />
            {errors.password && (
              <ErrorMessage message={errors.password.message} />
            )}
          </div>

          <CustomButton
            isSubmitting={isSubmitting}
            customContent={'Create Account'}
            customContentLoading={'Loading...'}
          />

          <span className="text-sm flex items-center justify-center w-full text-gray-500 gap-2">
            <p>Already have an account?</p>
            <a
              href="/auth/login"
              className="font-semibold underline underline-offset-4"
            >
              Login
            </a>
          </span>
        </form>
      </div>
    </AuthLayout>
  )
}
