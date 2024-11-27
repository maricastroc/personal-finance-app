import Layout from '@/components/layouts/layout.page'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import useRequest from '@/utils/useRequest'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Checkbox from '@radix-ui/react-checkbox'
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons'
import { notyf } from '@/lib/notyf'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { SignOut } from 'phosphor-react'
import { UserProps } from '@/types/user'
import { AvatarInput } from '@/components/shared/AvatarInput'
import { PasswordSection } from '@/components/shared/PasswordSection'
import { signOut } from 'next-auth/react'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { CustomButton } from '@/components/shared/CustomButton'
import { ErrorMessage } from '@/components/shared/ErrorMessage'

const editProfileFormSchema = (changePassword: boolean) =>
  z
    .object({
      email: z.string().min(3, { message: 'E-mail is required.' }),
      oldPassword: changePassword
        ? z.string().min(8, { message: 'Old password is required.' })
        : z.string().optional(),
      password: changePassword
        ? z
            .string()
            .min(8, { message: 'Password must be at least 8 characters long.' })
        : z.string().optional(),
      initialBalance: z
        .string()
        .min(1, { message: 'Initial balance value is required.' }),
      passwordConfirm: changePassword
        ? z
            .string()
            .min(8, { message: 'Password must be at least 8 characters long.' })
        : z.string().optional(),
      name: z.string().min(3, { message: 'Name is required.' }),
      avatarUrl: z
        .custom<File>((file) => file instanceof File && file.size > 0)
        .optional(),
    })
    .refine(
      (data) =>
        changePassword ? data.password === data.passwordConfirm : true,
      {
        message: "Passwords don't match",
        path: ['passwordConfirm'],
      },
    )

export type EditProfileFormData = z.infer<
  ReturnType<typeof editProfileFormSchema>
>

export default function Profile() {
  const inputFileRef = useRef<HTMLInputElement>(null)

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const isRouteLoading = useLoadingOnRouteChange()

  const [changePassword, setChangePassword] = useState(false)

  const { data: user } = useRequest<UserProps>({
    url: '/profile',
    method: 'GET',
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileFormSchema(changePassword)),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      passwordConfirm: '',
    },
  })

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/login' })
    notyf?.success('See you soon!')
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      setValue('avatarUrl', file)
      const reader = new FileReader()
      reader.onload = () => setAvatarPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  async function handleEditProfile(data: EditProfileFormData) {
    if (user) {
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('name', data.name)
      formData.append('initialBalance', data.initialBalance)
      formData.append('user_id', user.id.toString())

      if (data.avatarUrl) formData.append('avatarUrl', data.avatarUrl)
      if (data.oldPassword) formData.append('oldPassword', data.oldPassword)
      if (data.password) formData.append('password', data.password)

      try {
        const response = await api.put(`/profile/edit`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        notyf?.success(response.data.message)
      } catch (error) {
        handleApiError(error)
      }
    }
  }

  useEffect(() => {
    if (user) {
      setAvatarPreview(`${user.avatarUrl}`)
      setValue('name', user.name)
      setValue('email', user.email ?? '')
      setValue('initialBalance', String(user.initialBalance) || '')
    }
  }, [user, setValue])

  return isRouteLoading ? (
    <LoadingPage />
  ) : (
    <Layout>
      <div
        className={`w-full max-h-screen flex flex-col items-center justify-center p-4 pb-20 md:p-8 lg:p-12 overflow-y-scroll
        }`}
      >
        <div className="bg-white relative w-full px-5 py-6 rounded-md max-w-[35rem] xl:w-full overflow-y-scroll flex flex-col justify-start scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent">
          <div className="flex items-center justify-between w-full">
            <h2 className="font-bold text-2xl">Update Details</h2>
            <button className="bg-gray-900 p-2 rounded-full">
              <SignOut
                onClick={handleLogout}
                size={20}
                className="text-gray-100"
              />
            </button>
          </div>
          <form
            className="flex flex-col py-8 gap-4"
            onSubmit={handleSubmit(handleEditProfile)}
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
              <input
                type="text"
                id="initialBalance"
                className="text-sm w-full h-12 rounded-md border border-beige-500 px-3 items-center"
                placeholder="Your name here"
                {...register('initialBalance')}
              />
              {errors.initialBalance && (
                <ErrorMessage message={errors.initialBalance.message} />
              )}
            </div>

            <div className="flex items-center justify-start w-full gap-2">
              <Checkbox.Root
                checked={changePassword}
                onCheckedChange={(checked) =>
                  setChangePassword(checked === true)
                }
                className="flex items-center justify-center relative w-4 h-4 rounded-sm border-2 border-gray-600 text-white 
                        bg-transparent data-[state=checked]:bg-black data-[state=checked]:border-black"
              >
                <Checkbox.Indicator>
                  {changePassword ? <CheckIcon /> : <Cross2Icon />}
                </Checkbox.Indicator>
              </Checkbox.Root>
              <label
                htmlFor="changePassword"
                className="text-xs font-bold text-gray-500"
              >
                Change Password?
              </label>
            </div>

            <PasswordSection
              changePassword={changePassword}
              register={register}
              errors={errors}
            />

            <CustomButton isSubmitting={isSubmitting} />

            <span className="text-sm flex items-center justify-center w-full text-gray-500 gap-2">
              <p>Need to create an account?</p>
              <a
                href="/auth/signup"
                className="font-semibold underline underline-offset-4"
              >
                Sign up
              </a>
            </span>
          </form>
        </div>
      </div>
    </Layout>
  )
}
