/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import LogoMobile from "@public/assets/images/Logo.svg";
import { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AuthIllustration from "@public/assets/images/auth-illustration.png";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/home");
    }
  }, [session.status]);

  return (
    <div className="flex flex-col h-screen w-full max-w-[100rem] mx-auto">
      <header className="xl:hidden bg-surface-900 text-ink-50 w-full rounded-b-lg flex py-6 items-center justify-center">
        <Image src={LogoMobile} alt="Finance App logo" />
      </header>

      <div className="py-10 xl:py-0 flex-1 flex xl:overflow-hidden">
        <aside className="hidden xl:flex xl:w-1/2 xl:fixed xl:left-0 xl:top-0 xl:h-screen xl:p-3">
          <div className="w-full h-full relative rounded-2xl overflow-hidden bg-[#09090B]">
            <Image
              src={AuthIllustration}
              alt=""
              fill
              priority
              className="object-cover object-center opacity-55"
              sizes="50vw"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/55" />

            <div className="absolute top-6 left-6 z-10">
              <Image src={LogoMobile} alt="Finance App logo" />
            </div>

            <div className="absolute left-12 bottom-16 z-10 max-w-[360px]">
              <p className="text-white/30 text-xs uppercase tracking-[0.2em] mb-4">
                Personal Finance
              </p>

              <h2 className="text-white text-4xl font-semibold leading-tight tracking-tight">
                Keep track of your money and save for your future.
              </h2>

              <p className="text-white/40 text-sm mt-5 leading-relaxed">
                Budgets, pots, transactions and recurring bills — all in one
                place.
              </p>
            </div>
          </div>
        </aside>

        <main className="flex-1 xl:ml-[50%] xl:min-h-screen">
          <section
            aria-labelledby="auth-section-title"
            className="w-full flex items-center justify-center min-h-full xl:justify-start xl:items-center"
          >
            <h2 id="auth-section-title" className="sr-only">
              Authentication form
            </h2>
            <div
              className="relative mx-4 px-5 py-6 lg:px-12 lg:pt-12 lg:pb-8 rounded-3xl w-full max-w-[500px] xl:w-full flex flex-col justify-start xl:mx-auto my-8"
              style={{
                background: `
      linear-gradient(
        180deg,
        rgba(255,255,255,0.025) 0%,
        rgba(255,255,255,0) 100%
      ),
      #0F1117
    `,
                border: "1px solid rgba(255,255,255,0.03)",
                boxShadow: `
      inset 0 1px 0 rgba(255,255,255,0.04),
      0 40px 100px rgba(0,0,0,0.55),
      0 20px 40px rgba(0,0,0,0.35)
    `,
              }}
            >
              {children}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
