import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import AuthLayout from '../../../components/layouts/authLayout.page'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { ErrorMessage } from '@/components/shared/ErrorMessage'
import { AvatarInput } from '@/components/shared/AvatarInput'
import { CustomButton } from '@/components/shared/CustomButton'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { api } from '@/lib/axios'
import { notyf } from '@/lib/notyf'
import { handleApiError } from '@/utils/handleApiError'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'

const signUpFormSchema = z.object({
  email: z.string().min(3, { message: 'E-mail is required.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' }),
  initialBalance: z.number(),
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

  const [createWithDemo, setCreateWithDemo] = useState(false)

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
    formData.append('initialBalance', data.initialBalance.toString())
    formData.append('password', data.password)

    if (data.avatarUrl) formData.append('avatarUrl', data.avatarUrl)

    try {
      const response = await api.post(
        `${createWithDemo ? '/profile/with_demo' : '/profile'}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      )

      notyf?.success(response.data.message)

      router.push('/auth/login')
    } catch (error) {
      handleApiError(error)
    }
  }

  return isRouteLoading ? (
    <LoadingPage />
  ) : (
    <>
      <NextSeo title="Sign Up | Finance App" />
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
                  step="0.01"
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

            <div className="flex items-start justify-start w-full">
              <input
                checked={createWithDemo}
                onChange={() => setCreateWithDemo(!createWithDemo)}
                id="default-checkbox"
                type="checkbox"
                value=""
                className="w-8 h-8 accent-gray-900 text-gray-900 bg-gray-100 border-gray-300 rounded"
              />
              <label
                htmlFor="default-checkbox"
                className="ms-2 text-sm text-gray-500 font-bold mt-[0.3rem]"
              >
                Create with demo? By selecting this option, your user will
                automatically have transaction, budget, and pot data created.
              </label>
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
    </>
  )
}
