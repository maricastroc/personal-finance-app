import { ReactNode } from 'react'
import { Footer } from '../shared/Footer'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col w-screen min-h-screen">
      {children}
      <Footer />
    </div>
  )
}
