import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import AuthLayout from '../../../components/layouts/authLayout.page'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { AvatarInput } from '@/components/shared/AvatarInput'
import { CustomButton } from '@/components/shared/CustomButton'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { InputBase } from '@/components/core/InputBase'
import { CurrencyInput } from '@/components/core/CurrencyInput'
import { PasswordInput } from '@/components/core/PasswordInput'
import { ImageCropper } from '@/components/shared/ImageCropper'
import toast from 'react-hot-toast'

const signUpFormSchema = z.object({
  email: z.string().min(3, { message: 'E-mail is required.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' }),
  initialBalance: z
    .number({
      required_error: 'Initial balance is required.',
      invalid_type_error: 'Must be a valid number.',
    })
    .min(0, { message: 'Must be positive' }),
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

  const [showCropper, setShowCropper] = useState(false)

  const [originalImage, setOriginalImage] = useState<string | null>(null)

  const handleCroppedImage = (croppedImage: string) => {
    fetch(croppedImage)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], 'avatar.jpg', {
          type: 'image/jpeg',
        })
        setValue('avatarUrl', file)
        setAvatarPreview(croppedImage)
        setShowCropper(false)
      })
  }

  const {
    control,
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
        setOriginalImage(reader.result as string)
        setShowCropper(true)
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

      toast?.success(response.data.message)

      router.push('/auth/login')
    } catch (error) {
      handleApiError(error)
    }
  }

  return isRouteLoading ? (
    <LoadingPage />
  ) : (
    <>
      <NextSeo
        title="Sign Up | Finance App"
        additionalMetaTags={[
          {
            name: 'viewport',
            content:
              'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
          },
        ]}
      />
      <AuthLayout>
        {showCropper && originalImage && (
          <ImageCropper
            src={originalImage}
            onCrop={handleCroppedImage}
            aspectRatio={1}
            onClose={() => setShowCropper(false)}
          />
        )}

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

            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <InputBase
                  label="Name"
                  id="name"
                  type="text"
                  placeholder="Your name here"
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <InputBase
                  label="Email"
                  id="email"
                  type="email"
                  placeholder="Your email here"
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="initialBalance"
              control={control}
              render={({
                field: { value, onChange, ...field },
                fieldState,
              }) => (
                <CurrencyInput
                  label="Initial Balance"
                  id="initialBalance"
                  placeholder="Initial Balance"
                  currencySymbol="$"
                  value={value}
                  onChange={(val) => {
                    onChange(val)
                    setValue('initialBalance', val as number, {
                      shouldValidate: true,
                    })
                  }}
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <PasswordInput
                  label="Password"
                  id="password"
                  placeholder="Password"
                  className={`${
                    errors.initialBalance?.message ? 'mt-5' : 'mt-0'
                  }`}
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />

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
