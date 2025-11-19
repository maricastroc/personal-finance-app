/* eslint-disable react-hooks/exhaustive-deps */
import { api } from '@/lib/axios'
import { useEffect, useRef, useState } from 'react'
import { signOut } from 'next-auth/react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Checkbox from '@radix-ui/react-checkbox'
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons'
import { UserProps } from '@/types/user'
import Layout from '@/components/layouts/layout.page'
import { AvatarInput } from '@/components/core/AvatarInput'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { CustomButton } from '@/components/core/CustomButton'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { handleApiError } from '@/utils/handleApiError'
import useRequest from '@/utils/useRequest'
import { NextSeo } from 'next-seo'
import toast from 'react-hot-toast'
import { InputBase } from '@/components/core/InputBase'
import { PasswordInput } from '@/components/core/PasswordInput'
import { ImageCropper } from '@/components/shared/ImageCropper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons'

const editProfileFormSchema = (changePassword: boolean) =>
  z
    .object({
      email: z.string().min(3, { message: 'E-mail is required.' }),
      accountId: z.string().optional(),
      oldPassword: changePassword
        ? z.string().min(8, { message: 'Old password is required.' })
        : z.string().optional(),
      password: changePassword
        ? z
            .string()
            .min(8, { message: 'Password must be at least 8 characters long.' })
        : z.string().optional(),
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

  const [showCropper, setShowCropper] = useState(false)

  const [originalImage, setOriginalImage] = useState<string | null>(null)

  const { data: user } = useRequest<UserProps>({
    url: '/profile',
    method: 'GET',
  })

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
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
    toast?.success('See you soon!')
  }

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

  async function handleEditProfile(data: EditProfileFormData) {
    if (user) {
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('name', data.name)
      formData.append('user_id', user.id.toString())

      if (data.avatarUrl) formData.append('avatarUrl', data.avatarUrl)
      if (data.oldPassword) formData.append('oldPassword', data.oldPassword)
      if (data.password) formData.append('password', data.password)

      try {
        const response = await api.put(`/profile`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        toast?.success(response.data.message)
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
    }
  }, [user, setValue])

  useEffect(() => {
    if (!changePassword) {
      setValue('oldPassword', '')
      setValue('password', '')
      setValue('passwordConfirm', '')
    }
  }, [changePassword])

  return isRouteLoading ? (
    <LoadingPage />
  ) : (
    <>
      <NextSeo
        title="Profile | Finance App"
        additionalMetaTags={[
          {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0',
          },
        ]}
      />
      <Layout>
        {showCropper && originalImage && (
          <ImageCropper
            src={originalImage}
            onCrop={handleCroppedImage}
            aspectRatio={1}
            onClose={() => setShowCropper(false)}
          />
        )}

        <div
          className={`w-full flex flex-col items-center justify-center p-4 pb-20 md:p-8 lg:p-12 overflow-y-scroll
        }`}
        >
          <div className="bg-white relative w-full px-5 py-6 rounded-md max-w-[35rem] xl:w-full overflow-y-scroll flex flex-col justify-start scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent">
            <div className="flex items-center justify-between w-full">
              <h2 className="font-bold text-2xl">Update Details</h2>
              <button
                onClick={handleLogout}
                className={`font-semibold rounded-md p-3 px-4 items-center flex gap-2 transition-all duration-300 max-h-[60px] text-sm bg-gray-900 text-beige-100 hover:bg-gray-500 capitalize justify-center disabled:bg-gray-400 disabled:text-gray-100 disabled:cursor-not-allowed`}
              >
                <FontAwesomeIcon icon={faRightToBracket} />
                <p className="hidden sm:block">Logout</p>
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

              <Controller
                name="accountId"
                control={control}
                render={({ field, fieldState }) => (
                  <InputBase
                    disabled
                    label="Account ID"
                    id="name"
                    type="text"
                    placeholder="Your Account ID"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
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

              {changePassword && (
                <>
                  <Controller
                    name="oldPassword"
                    control={control}
                    render={({ field, fieldState }) => (
                      <PasswordInput
                        label="Your current password"
                        id="oldPassword"
                        placeholder="Password"
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
                        label="Your new password"
                        id="password"
                        placeholder="Password"
                        error={fieldState.error?.message}
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="passwordConfirm"
                    control={control}
                    render={({ field, fieldState }) => (
                      <PasswordInput
                        label="Confirm new password"
                        id="passwordConfirm"
                        placeholder="Password"
                        error={fieldState.error?.message}
                        {...field}
                      />
                    )}
                  />
                </>
              )}

              <CustomButton isSubmitting={isSubmitting} />
            </form>
          </div>
        </div>
      </Layout>
    </>
  )
}
