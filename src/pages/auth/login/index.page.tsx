import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoadingPage } from '@/components/shared/LoadingPage'
import AuthLayout from '@/components/layouts/authLayout.page'
import { ErrorMessage } from '@/components/shared/ErrorMessage'
import { CustomButton } from '@/components/shared/CustomButton'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { handleApiError } from '@/utils/handleApiError'
import { notyf } from '@/lib/notyf'

const signInFormSchema = z.object({
  email: z.string().min(3, { message: 'E-mail is required.' }),
  password: z.string().min(3, { message: 'Password is required' }),
})

type SignInFormData = z.infer<typeof signInFormSchema>

export default function Login() {
  const router = useRouter()

  const isRouteLoading = useLoadingOnRouteChange()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data: SignInFormData) {
    try {
      const response = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (response?.error) {
        notyf?.error(response?.error)
      } else {
        notyf?.success('Welcome to the Finance App!')
        router.push('/')
      }
    } catch (error) {
      handleApiError(error)
    }
  }

  async function onSubmitDemo() {
    try {
      const demoLogin = process.env.NEXT_PUBLIC_DEMO_LOGIN;
      const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD;

      const response = await signIn('credentials', {
        email: demoLogin,
        password: demoPassword,
        redirect: false,
      })

      if (response?.error) {
        notyf?.error(response?.error)
      } else {
        notyf?.success('Welcome to the Finance App!')
        router.push('/')
      }
    } catch (error) {
      handleApiError(error)
    }
  }

  return isRouteLoading ? (
    <LoadingPage />
  ) : (
    <>
      <NextSeo title="Login | Finance App" />
      <AuthLayout>
        <div className="bg-white relative mx-4 px-5 py-6 rounded-md w-full max-w-[500px] xl:w-full flex flex-col justify-start xl:mx-auto">
          <h2 className="font-bold text-2xl">Login</h2>
          <form
            className="flex flex-col py-8 gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
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
              {errors?.email && <ErrorMessage message={errors.email.message} />}
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
              {errors?.password && (
                <ErrorMessage message={errors.password.message} />
              )}
            </div>

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
