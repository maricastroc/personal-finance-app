import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoadingPage } from '@/components/shared/LoadingPage'
import AuthLayout from '@/components/layouts/authLayout.page'
import { CustomButton } from '@/components/shared/CustomButton'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { handleApiError } from '@/utils/handleApiError'
import { InputBase } from '@/components/core/InputBase'
import { PasswordInput } from '@/components/core/PasswordInput'
import toast from 'react-hot-toast'

const signInFormSchema = z.object({
  email: z.string().min(3, { message: 'E-mail is required.' }),
  password: z.string().min(3, { message: 'Password is required' }),
})

type SignInFormData = z.infer<typeof signInFormSchema>

export default function Login() {
  const router = useRouter()

  const isRouteLoading = useLoadingOnRouteChange()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { email: '', password: '' },
  })

  async function handleLogin(email: string, password: string) {
    try {
      const response = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (response?.error) {
        toast?.error(response.error)
      } else {
        toast?.success('Welcome to the Finance App!')
        router.push('/')
      }
    } catch (error) {
      handleApiError(error)
    }
  }

  async function onSubmit(data: SignInFormData) {
    await handleLogin(data.email, data.password)
  }

  async function onSubmitDemo() {
    await handleLogin(
      process.env.NEXT_PUBLIC_DEMO_LOGIN!,
      process.env.NEXT_PUBLIC_DEMO_PASSWORD!,
    )
  }

  return isRouteLoading ? (
    <LoadingPage />
  ) : (
    <>
      <NextSeo
        title="Login | Finance App"
        additionalMetaTags={[
          {
            name: 'viewport',
            content:
              'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
          },
        ]}
      />
      <AuthLayout>
        <div className="bg-white relative mx-4 px-5 py-6 rounded-md w-full max-w-[500px] xl:w-full flex flex-col justify-start xl:mx-auto">
          <h2 className="font-bold text-2xl">Login</h2>
          <form
            className="flex flex-col py-8 gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
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
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <PasswordInput
                  label="Password"
                  id="password"
                  placeholder="Password"
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />

            <CustomButton
              customContent={'Login'}
              customContentLoading={'Loading...'}
              isSubmitting={isSubmitting}
            />

            <div className="flex flex-col gap-1">
              <span className="text-sm flex items-center justify-center w-full text-gray-500 gap-2">
                <p>Need to create an account?</p>
                <a
                  href="/auth/signup"
                  className="font-semibold underline underline-offset-4"
                >
                  Sign up
                </a>
              </span>
              <span className="text-sm flex items-center justify-center w-full text-gray-500 gap-2">
                <p>You&apos;re just browsing?</p>
                <button
                  onClick={onSubmitDemo}
                  type="button"
                  className="font-semibold underline underline-offset-4"
                >
                  See Demo
                </button>
              </span>
            </div>
          </form>
        </div>
      </AuthLayout>
    </>
  )
}
