import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { AppProps } from "next/app";
import { AppProvider } from "@/contexts/AppContext";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { BalanceProvider } from "@/contexts/BalanceContext";

const font = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Toaster
        toastOptions={{
          style: {
            backgroundColor: "var(--toast-bg)",
            color: "var(--foreground)",
            border: "1px solid var(--toast-border)",
          },
          success: {
            style: {
              backgroundColor: "var(--toast-bg-accent)",
              color: "var(--foreground)",
            },
          },
          error: {
            style: {
              backgroundColor: "var(--toast-bg-accent)",
              color: "var(--foreground)",
            },
          },
        }}
      />
      <AppProvider>
        <BalanceProvider>
          <div
            className={`${font.className} bg-surface-950 overflow-x-hidden h-full`}
          >
            <Component {...pageProps} />
          </div>
        </BalanceProvider>
      </AppProvider>
    </SessionProvider>
  );
}

export default MyApp;
