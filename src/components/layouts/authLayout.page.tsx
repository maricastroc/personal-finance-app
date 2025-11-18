import Image from 'next/image'
import LogoMobile from '../../../public/assets/images/Logo.svg'
import BackgroundImage from '../../../public/assets/images/illustration-authentication.svg'
import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex flex-col h-screen w-full max-w-[100rem] mx-auto">
      <header className="xl:hidden bg-gray-900 text-gray-100 w-full rounded-b-lg flex py-6 items-center justify-center">
        <Image src={LogoMobile} alt="Finance App logo" />
      </header>

      <div className="py-10 xl:py-0 flex-1 flex xl:overflow-hidden">
        <aside className="hidden xl:flex xl:w-1/2 xl:fixed xl:left-0 xl:top-0 xl:h-screen xl:p-3">
          <div className="w-full h-full relative rounded-md overflow-hidden">
            <Image
              src={BackgroundImage}
              alt=""
              role="presentation"
              className="object-cover w-full h-full rounded-md"
              fill
              priority
            />

            <div className="absolute top-[1.5rem] left-[1rem] w-[8.5rem] p-4 text-white z-10">
              <Image src={LogoMobile} alt="Finance App logo" />
            </div>

            <div className="absolute bottom-[1.5rem] right-[3rem] w-[28rem] p-4 text-white z-10">
              <h1 className="leading-10 text-3xl font-bold drop-shadow-md">
                Keep track of your money and save for your future
              </h1>
              <p className="text-sm mt-4 drop-shadow">
                Personal finance app puts you in control of your spending. Track
                transactions, set budgets, and add to savings pots easily.
              </p>
            </div>
          </div>
        </aside>

        <main className="flex-1 xl:ml-[50%] xl:min-h-screen xl:overflow-y-auto">
          <section
            aria-label="Authentication form"
            className="w-full flex items-center justify-center min-h-full xl:justify-start xl:items-center"
          >
            <div className="w-full xl:mx-20 flex justify-center items-center">
              <div
                className="
                  bg-white 
                  relative 
                  mx-4 px-5 py-6 lg:p-8 lg:pb-0
                  rounded-md
                  w-full max-w-[600px]
                  xl:w-full
                  flex flex-col justify-start
                  xl:mx-auto my-8
                "
              >
                {children}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
