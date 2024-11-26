import { ReactNode } from 'react'
import { Footer } from '../shared/Footer'
import { Sidebar } from '../shared/Sidebar'
import { useAppContext } from '@/contexts/AppContext'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { isSidebarOpen, handleIsSidebarOpen } = useAppContext()

  return (
    <div
      className={`flex flex-col w-screen min-h-screen h-full ${
        isSidebarOpen ? 'lg:pl-[17rem]' : 'lg:pl-[10rem]'
      }`}
    >
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        handleIsSidebarOpen={() => handleIsSidebarOpen(!isSidebarOpen)}
      />
      {children}
      <Footer />
    </div>
  )
}
