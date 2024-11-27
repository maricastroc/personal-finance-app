import Image from 'next/image'
import LogoMobile from '../../../public/assets/images/Logo.svg'
import BackgroundImage from '../../../public/assets/images/illustration-authentication.svg'
import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex flex-col h-screen w-full max-w-[100rem]">
      <header className="xl:hidden bg-gray-900 text-gray-100 w-full rounded-b-lg flex py-6 items-center justify-center">
        <Image src={LogoMobile} alt="Logo Mobile" />
      </header>

      <div className="py-10 xl:py-0 flex-1 flex items-center justify-center xl:grid xl:grid-cols-[1fr,1.15fr] xl:gap-8 w-full">
        <div className="h-full w-full relative hidden xl:flex max-h-screen rounded-md overflow-hidden p-3">
          <div className="w-full h-full relative rounded-md overflow-hidden">
            <Image
              src={BackgroundImage}
              alt="Background"
              className="object-cover w-full h-full rounded-md"
            />
          </div>
          <div className="absolute top-[1.5rem] left-[1rem] w-[8.5rem] p-4 text-white">
            <Image src={LogoMobile} alt="Logo Mobile" />
          </div>
          <div className="absolute bottom-[1.5rem] right-[3rem] w-[28rem] p-4 text-white">
            <h1 className="leading-10 text-3xl font-bold">
              Keep track of your money and save for your future
            </h1>
            <p className="text-sm mt-4">
              Personal finance app puts you in control of your spending. Track
              transactions, set budgets, and add to savings pots easily.
            </p>
          </div>
        </div>

        {children}
      </div>
    </div>
  )
}
