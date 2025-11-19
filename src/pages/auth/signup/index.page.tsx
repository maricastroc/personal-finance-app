import { useState } from "react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import AuthLayout from "@/components/layouts/authLayout.page";
import { LoadingPage } from "@/components/shared/LoadingPage";
import { PrimaryButton } from "@/components/core/PrimaryButton";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { api } from "@/lib/axios";
import { handleApiError } from "@/utils/handleApiError";
import { useLoadingOnRouteChange } from "@/utils/useLoadingOnRouteChange";
import { InputBase } from "@/components/core/InputBase";
import { PasswordInput } from "@/components/core/PasswordInput";
import toast from "react-hot-toast";
import { TextLink } from "@/components/core/TextLink";

const signUpFormSchema = z.object({
  email: z.string().min(3, { message: "E-mail is required." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
  name: z.string().min(3, { message: "Name is required." }),
});

type SignUpFormData = z.infer<typeof signUpFormSchema>;

export default function SignUp() {
  const isRouteLoading = useLoadingOnRouteChange();

  const router = useRouter();

  const [createWithDemo, setCreateWithDemo] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: { email: "", password: "", name: "" },
  });

  async function handleSignUp(data: SignUpFormData) {
    const formData = new FormData();

    formData.append("email", data.email);
    formData.append("name", data.name);
    formData.append("password", data.password);

    try {
      const response = await api.post(
        `${createWithDemo ? "/profile/with_demo" : "/profile"}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast?.success(response.data.message);

      router.push("/auth/login");
    } catch (error) {
      handleApiError(error);
    }
  }

  return isRouteLoading ? (
    <LoadingPage />
  ) : (
    <>
      <NextSeo
        title="Sign Up | Finance App"
        additionalMetaTags={[
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          },
        ]}
      />

      <AuthLayout>
        <h1 id="form-title" className="font-bold text-2xl">
          Sign Up
        </h1>

        <form
          className="flex flex-col py-8 gap-4"
          onSubmit={handleSubmit(handleSignUp)}
          aria-labelledby="form-title"
        >
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <InputBase
                required
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
                required
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
                required
                label="Password"
                id="password"
                placeholder="Password"
                error={fieldState.error?.message}
                {...field}
              />
            )}
          />

          <fieldset
            className="flex items-start gap-2"
            aria-describedby="demo-desc"
          >
            <legend className="sr-only">Create account with demo data</legend>

            <input
              name="createWithDemo"
              value="true"
              checked={createWithDemo}
              onChange={() => setCreateWithDemo(!createWithDemo)}
              id="createWithDemo"
              type="checkbox"
              className="w-6 h-6 accent-gray-900"
            />

            <label
              htmlFor="createWithDemo"
              className="text-sm text-gray-500 font-bold leading-snug"
            >
              Create with demo?
              <span id="demo-desc" className="block font-normal">
                By selecting this option, your user will automatically have
                transaction, budget, and pot data created.
              </span>
            </label>
          </fieldset>

          <PrimaryButton isSubmitting={isSubmitting}>
            Create account
          </PrimaryButton>

          <p className="text-sm flex items-center justify-center w-full text-gray-500 gap-2">
            Already have an account?
            <TextLink href="/auth/login">Login</TextLink>
          </p>
        </form>
      </AuthLayout>
    </>
  );
}
