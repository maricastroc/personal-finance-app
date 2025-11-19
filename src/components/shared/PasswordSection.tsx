import { EditProfileFormData } from "@/pages/profile/index.page";
import { UseFormRegister, FieldErrors } from "react-hook-form";

type PasswordSectionProps = {
  changePassword: boolean;
  register: UseFormRegister<EditProfileFormData>;
  errors: FieldErrors<EditProfileFormData>;
};

export function PasswordSection({
  changePassword,
  register,
  errors,
}: PasswordSectionProps) {
  if (!changePassword) return null;

  return (
    <>
      <div>
        <label
          htmlFor="oldPassword"
          className="text-xs font-bold text-gray-500 mb-1"
        >
          Current Password
        </label>

        <input
          type="password"
          id="oldPassword"
          className="text-sm w-full h-12 rounded-md border border-beige-500 px-3"
          placeholder="Enter your current password"
          aria-invalid={!!errors.oldPassword}
          aria-describedby={
            errors.oldPassword ? "oldPassword-error" : undefined
          }
          {...register("oldPassword")}
        />

        {errors.oldPassword && (
          <span
            id="oldPassword-error"
            className="text-secondary-red font-semibold text-xs"
          >
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
          className="text-sm w-full h-12 rounded-md border border-beige-500 px-3"
          placeholder="Enter a new password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />

        {errors.password && (
          <span
            id="password-error"
            className="text-secondary-red font-semibold text-xs"
          >
            {errors.password.message}
          </span>
        )}
      </div>

      <div>
        <label
          htmlFor="passwordConfirm"
          className="text-xs font-bold text-gray-500 mb-1"
        >
          Confirm New Password
        </label>

        <input
          type="password"
          id="passwordConfirm"
          className="text-sm w-full h-12 rounded-md border border-beige-500 px-3"
          placeholder="Re-enter your new password"
          aria-invalid={!!errors.passwordConfirm}
          aria-describedby={
            errors.passwordConfirm ? "passwordConfirm-error" : undefined
          }
          {...register("passwordConfirm")}
        />

        {errors.passwordConfirm && (
          <span
            id="passwordConfirm-error"
            className="text-secondary-red font-semibold text-xs"
          >
            {errors.passwordConfirm.message}
          </span>
        )}
      </div>
    </>
  );
}
