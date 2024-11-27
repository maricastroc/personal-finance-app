import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import AuthLayout from '../../../components/layouts/authLayout.page'
import { LoadingPage } from '@/components/shared/LoadingPage'

export default function SignUp() {
  const isRouteLoading = useLoadingOnRouteChange()

  return isRouteLoading ? (
    <LoadingPage />
  ) : (
    <AuthLayout>
      <div className="bg-white relative mx-4 px-5 py-6 rounded-md w-full max-w-[500px] xl:w-full flex flex-col justify-start xl:mx-auto">
        <h2 className="font-bold text-2xl">Sign Up</h2>
        <div className="flex flex-col py-8 gap-4">
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
            />
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
            />
          </div>

          <button className="font-semibold rounded-md p-3 items-center flex gap-2 transition-all duration-300 max-h-[60px] bg-gray-900 text-beige-100 hover:bg-gray-500 capitalize justify-center mt-8">
            Create Account
          </button>

          <span className="text-sm flex items-center justify-center w-full text-gray-500 gap-2">
            <p>Already have an account?</p>
            <a
              href="/auth/login"
              className="font-semibold underline underline-offset-4"
            >
              Login
            </a>
          </span>
        </div>
      </div>
    </AuthLayout>
  )
}
