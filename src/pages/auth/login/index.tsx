import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoadingOnRouteChange } from "@/utils/useLoadingOnRouteChange";
import { handleApiError } from "@/utils/handleApiError";
import { LoadingPage } from "@/components/shared/LoadingPage";
import AuthLayout from "@/components/layouts/authLayout.page";
import { PrimaryButton } from "@/components/core/PrimaryButton";
import { InputBase } from "@/components/core/InputBase";
import { PasswordInput } from "@/components/core/PasswordInput";
import { TextLink } from "@/components/core/TextLink";

const signInFormSchema = z.object({
  email: z.string().min(3, { message: "E-mail is required." }),
  password: z.string().min(3, { message: "Password is required." }),
});

type SignInFormData = z.infer<typeof signInFormSchema>;

export default function Login() {
  const router = useRouter();

  const isRouteLoading = useLoadingOnRouteChange();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { email: "", password: "" },
  });

  async function handleLogin(email: string, password: string) {
    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (response?.error) {
        toast.error(response.error);
      } else {
        toast.success("Welcome to the Finance App!");
        router.push("/home");
      }
    } catch (error) {
      handleApiError(error);
    }
  }

  async function onSubmit(data: SignInFormData) {
    await handleLogin(data.email, data.password);
  }

  async function onSubmitDemo() {
    await handleLogin(
      process.env.NEXT_PUBLIC_DEMO_LOGIN!,
      process.env.NEXT_PUBLIC_DEMO_PASSWORD!
    );
  }

  return isRouteLoading ? (
    <LoadingPage />
  ) : (
    <>
      <NextSeo
        title="Login | Finance App"
        additionalMetaTags={[
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          },
        ]}
      />
      <AuthLayout>
        <h1 className="font-bold text-2xl">Login</h1>

        <form
          className="flex flex-col py-8 gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
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
          <PrimaryButton
            className="mt-8"
            type="submit"
            isSubmitting={isSubmitting}
          >
            Login
          </PrimaryButton>

          <section className="flex flex-col gap-1">
            <p className="text-sm flex items-center justify-center w-full text-grey-500 gap-2">
              Need to create an account?
              <TextLink href="/auth/signup">Sign up</TextLink>
            </p>

            <p className="text-sm flex items-center justify-center w-full text-grey-500 gap-2">
              You’re just browsing?
              <TextLink as="button" type="button" onClick={onSubmitDemo}>
                Demo Login
              </TextLink>
            </p>
          </section>
        </form>
      </AuthLayout>
    </>
  );
}
