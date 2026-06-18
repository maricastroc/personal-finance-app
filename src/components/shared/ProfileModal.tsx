import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, X, LogOut } from "lucide-react";
import { UserProps } from "@/types/user";
import { PrimaryButton } from "@/components/core/PrimaryButton";
import { handleApiError } from "@/utils/handleApiError";
import useRequest from "@/utils/useRequest";
import toast from "react-hot-toast";
import { InputBase } from "@/components/core/InputBase";
import { PasswordInput } from "@/components/core/PasswordInput";

const editProfileFormSchema = (changePassword: boolean) =>
  z
    .object({
      email: z.string().min(3, { message: "E-mail is required." }),
      oldPassword: changePassword
        ? z.string().min(8, { message: "Old password is required." })
        : z.string().optional(),
      password: changePassword
        ? z
            .string()
            .min(8, { message: "Password must be at least 8 characters long." })
        : z.string().optional(),
      passwordConfirm: changePassword
        ? z
            .string()
            .min(8, { message: "Password must be at least 8 characters long." })
        : z.string().optional(),
      name: z.string().min(3, { message: "Name is required." }),
    })
    .refine(
      (data) =>
        changePassword ? data.password === data.passwordConfirm : true,
      { message: "Passwords don't match", path: ["passwordConfirm"] }
    );

type EditProfileFormData = z.infer<ReturnType<typeof editProfileFormSchema>>;

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [changePassword, setChangePassword] = useState(false);

  const { data: user } = useRequest<UserProps>({
    url: "/profile",
    method: "GET",
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileFormSchema(changePassword)),
    defaultValues: { email: "", name: "", password: "", passwordConfirm: "" },
  });

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    toast?.success("See you soon!");
  };

  async function handleEditProfile(data: EditProfileFormData) {
    if (!user) return;

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("name", data.name);
    formData.append("user_id", user.id.toString());
    if (data.oldPassword) formData.append("oldPassword", data.oldPassword);
    if (data.password) formData.append("password", data.password);

    try {
      const response = await api.put(`/profile`, formData);
      toast?.success(response.data.message);
      onClose();
    } catch (error) {
      handleApiError(error);
    }
  }

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email ?? "");
    }
  }, [user, setValue]);

  useEffect(() => {
    if (!changePassword) {
      setValue("oldPassword", "");
      setValue("password", "");
      setValue("passwordConfirm", "");
    }
  }, [changePassword, setValue]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[990] bg-black/60 backdrop-blur-sm" />

        <Dialog.Content
          aria-labelledby="profile-modal-title"
          aria-describedby="profile-modal-desc"
          className="max-h-[90vh] overflow-y-auto scrollbar-none fixed z-[999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[480px] rounded-xl shadow-2xl p-6 md:p-8"
          style={{
            background: "var(--surface-800)",
            border: "1px solid var(--card-border)",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title
              id="profile-modal-title"
              className="text-xl font-semibold text-ink-50"
            >
              Profile
            </Dialog.Title>

            <Dialog.Close
              aria-label="Close modal"
              onClick={onClose}
              className="text-ink-400 hover:text-ink-100 hover:bg-surface-700 transition-all duration-200 p-1 rounded-full focus:outline-2 focus:outline-accent-green focus:outline-offset-1"
            >
              <X size={16} />
            </Dialog.Close>
          </div>

          <Dialog.Description id="profile-modal-desc" className="sr-only">
            Update your name, email or password.
          </Dialog.Description>

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(handleEditProfile)}
          >
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <InputBase
                  label="Name"
                  id="profile-name"
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
                  id="profile-email"
                  type="email"
                  placeholder="Your email here"
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />

            <div className="flex items-center gap-2">
              <Checkbox.Root
                id="changePassword"
                checked={changePassword}
                onCheckedChange={(checked) =>
                  setChangePassword(checked === true)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setChangePassword((prev) => !prev);
                  }
                }}
                className="flex items-center focus:outline-2 focus:outline-offset-2 focus:outline-accent-green justify-center w-4 h-4 rounded-sm border-2 border-ink-400 text-ink-50 bg-transparent data-[state=checked]:bg-accent-green data-[state=checked]:border-accent-green"
              >
                <Checkbox.Indicator>
                  {changePassword ? <Check size={12} /> : <X size={12} />}
                </Checkbox.Indicator>
              </Checkbox.Root>
              <label
                htmlFor="changePassword"
                className="text-xs font-medium text-ink-300 cursor-pointer"
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
                      label="Current password"
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
                      label="New password"
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

            <PrimaryButton isSubmitting={isSubmitting}>
              Save Changes
            </PrimaryButton>
          </form>

          <div className="mt-4 pt-4 border-t border-surface-600">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-ink-400 hover:text-accent-red transition-colors focus:outline-2 focus:outline-accent-green focus:outline-offset-1 rounded"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
