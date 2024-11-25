import { EditProfileFormData } from '@/pages/profile/index.page'
import { UseFormRegister, FieldErrors } from 'react-hook-form'

type PasswordSectionProps = {
  changePassword: boolean
  register: UseFormRegister<EditProfileFormData>
  errors: FieldErrors<EditProfileFormData>
}

export function PasswordSection({
  changePassword,
  register,
  errors,
}: PasswordSectionProps) {
  if (!changePassword) return null

  return (
    <>
      <div>
        <label
          htmlFor="password"
          className="text-xs font-bold text-gray-500 mb-1"
        >
          Actual Password
        </label>
        <input
          type="password"
          id="password"
          className="text-sm w-full h-12 rounded-md border border-beige-500 px-3 items-center"
          placeholder="Password"
          {...register('oldPassword')}
        />
        {errors.oldPassword && (
          <span className="text-secondary-red font-semibold text-xs">
            {errors.oldPassword.message}
          </span>
        )}
      </div>
      <div>
        <label
          htmlFor="password"
          className="text-xs font-bold text-gray-500 mb-1"
        >
          New Password
        </label>
        <input
          type="password"
          id="password"
          className="text-sm w-full h-12 rounded-md border border-beige-500 px-3 items-center"
          placeholder="Password"
          {...register('password')}
        />
        {errors.password && (
          <span className="text-secondary-red font-semibold text-xs">
            {errors.password.message}
          </span>
        )}
      </div>
      <div>
        <label
          htmlFor="password"
          className="text-xs font-bold text-gray-500 mb-1"
        >
          Confirm New Password
        </label>
        <input
          type="password"
          id="passwordConfirm"
          className="text-sm w-full h-12 rounded-md border border-beige-500 px-3 items-center"
          placeholder="Password"
          {...register('passwordConfirm')}
        />
        {errors.passwordConfirm && (
          <span className="text-secondary-red font-semibold text-xs">
            {errors.passwordConfirm.message}
          </span>
        )}
      </div>
    </>
  )
}
