import AuthLayout from '@/components/layouts/authLayout.page'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

const signInFormSchema = z.object({
  email: z.string().min(3, { message: 'E-mail is required.' }),
  password: z.string().min(3, { message: 'Password is required' }),
})

type SignInFormData = z.infer<typeof signInFormSchema>

export default function Login() {
  const router = useRouter()

  const { register, handleSubmit } = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data: SignInFormData) {
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error(result?.error)
      } else {
        toast.success('Welcome to the Finance App!')
        router.push('/')
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.')
      console.error(error)
    }
  }

  return (
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
          </div>

          <button className="font-semibold rounded-md p-3 items-center flex gap-2 transition-all duration-300 max-h-[60px] bg-gray-900 text-beige-100 hover:bg-gray-500 capitalize justify-center mt-8">
            Login
          </button>

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
    </AuthLayout>
  )
}
