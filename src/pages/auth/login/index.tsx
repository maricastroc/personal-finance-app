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
            className="
    mt-8
    h-12
    rounded-xl
    bg-gradient-to-b
    from-[#F8FAFC]
    to-[#E5E7EB]
    text-[#111827]
    font-medium
    shadow-md
    transition-all
    duration-200
    hover:from-white
    hover:to-[#F3F4F6]
    hover:shadow-xl
    active:scale-[0.99]
  "
            type="submit"
            isSubmitting={isSubmitting}
          >
            Sign in
          </PrimaryButton>

          <section className="flex flex-col gap-3 mt-2">
            <p className="text-sm flex items-center justify-center w-full text-white/40 gap-2">
              Need to create an account?
              <TextLink
                href="/auth/signup"
                className="text-white/75 hover:text-white transition-colors"
              >
                Sign up
              </TextLink>
            </p>

            <p className="text-sm flex items-center justify-center w-full text-white/40 gap-2">
              You’re just browsing?
              <TextLink
                aria-label="Log in using a demo account to test the app."
                as="button"
                type="button"
                onClick={onSubmitDemo}
                className="text-white/75 hover:text-white transition-colors"
              >
                Demo Login
              </TextLink>
            </p>
          </section>
        </form>
      </AuthLayout>
    </>
  );
}
