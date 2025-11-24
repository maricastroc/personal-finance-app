/* eslint-disable react-hooks/exhaustive-deps */
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { UserProps } from "@/types/user";
import Layout from "@/components/layouts/layout.page";
import { LoadingPage } from "@/components/shared/LoadingPage";
import { PrimaryButton } from "@/components/core/PrimaryButton";
import { useLoadingOnRouteChange } from "@/utils/useLoadingOnRouteChange";
import { handleApiError } from "@/utils/handleApiError";
import useRequest from "@/utils/useRequest";
import { NextSeo } from "next-seo";
import toast from "react-hot-toast";
import { InputBase } from "@/components/core/InputBase";
import { PasswordInput } from "@/components/core/PasswordInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";

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
      {
        message: "Passwords don't match",
        path: ["passwordConfirm"],
      }
    );

export type EditProfileFormData = z.infer<
  ReturnType<typeof editProfileFormSchema>
>;

export default function Profile() {
  const isRouteLoading = useLoadingOnRouteChange();

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
    defaultValues: {
      email: "",
      name: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    toast?.success("See you soon!");
  };

  async function handleEditProfile(data: EditProfileFormData) {
    if (user) {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("name", data.name);
      formData.append("user_id", user.id.toString());

      if (data.oldPassword) formData.append("oldPassword", data.oldPassword);
      if (data.password) formData.append("password", data.password);

      try {
        const response = await api.put(`/profile`, formData);

        toast?.success(response.data.message);
      } catch (error) {
        handleApiError(error);
      }
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
  }, [changePassword]);

  return isRouteLoading ? (
    <LoadingPage />
  ) : (
    <>
      <NextSeo
        title="Profile | Finance App"
        additionalMetaTags={[
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          },
        ]}
      />
      <Layout>
        <div
          className={`w-full h-[100vh] flex flex-col items-center justify-center p-4 pb-20 md:p-8 lg:p-12
        }`}
        >
          <div className="bg-white shadow-lg relative w-full px-5 py-6 rounded-md max-w-[35rem] xl:w-full flex flex-col justify-start scrollbar scrollbar-thumb-grey-500 scrollbar-track-transparent">
            <div className="flex items-center justify-between w-full">
              <h2 className="font-bold text-2xl">Update Profile</h2>
              <button
                onClick={handleLogout}
                className={`font-semibold rounded-md focus:outline-secondary-green focus:outline-offset-2 focus:outline-2 p-3 px-4 items-center flex gap-2 transition-all duration-300 max-h-[60px] text-sm bg-secondary-red text-beige-100 hover:bg-secondary-redHover capitalize justify-center disabled:bg-grey-300 disabled:text-white disabled:cursor-not-allowed`}
              >
                <FontAwesomeIcon icon={faRightToBracket} />
                <p className="hidden sm:block">Logout</p>
              </button>
            </div>
            <form
              className="flex flex-col pt-8 gap-4"
              onSubmit={handleSubmit(handleEditProfile)}
            >
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
                  className="flex items-center focus:outline-2 focus:outline-offset-2 focus:outline-secondary-green justify-center relative w-4 h-4 rounded-sm border-2 border-grey-500 text-white 
                        bg-transparent data-[state=checked]:bg-black data-[state=checked]:border-black"
                >
                  <Checkbox.Indicator>
                    {changePassword ? <CheckIcon /> : <Cross2Icon />}
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <label
                  htmlFor="changePassword"
                  className="text-xs font-bold text-grey-500"
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

              <PrimaryButton isSubmitting={isSubmitting}>
                Save Changes
              </PrimaryButton>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
}
