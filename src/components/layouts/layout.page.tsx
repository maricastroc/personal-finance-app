/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect } from "react";
import { Footer } from "../shared/Footer";
import { useAppContext } from "@/contexts/AppContext";
import { Sidebar } from "../shared/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isSidebarOpen, handleIsSidebarOpen } = useAppContext();

  const session = useSession();

  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/");
    }
  }, [session.status]);

  return (
    <div
      className={`flex flex-col w-screen min-h-screen h-full ${
        isSidebarOpen ? "lg:pl-[17rem]" : "lg:pl-[10rem]"
      }`}
    >
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        handleIsSidebarOpen={() => handleIsSidebarOpen(!isSidebarOpen)}
      />

      <main id="main-content" className="flex-grow min-h-[100vh]">
        {children}
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}
