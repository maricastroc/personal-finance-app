import { Public_Sans } from "next/font/google";
import "@/styles/globals.css";
import { AppProps } from "next/app";
import { AppProvider } from "@/contexts/AppContext";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

const font = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Toaster
        toastOptions={{
          style: {
            backgroundColor: "#201f24",
            color: "#fff",
          },
          success: {
            style: {
              backgroundColor: "#201f24",
              color: "#fff",
            },
          },
          error: {
            style: {
              backgroundColor: "#201f24",
              color: "#fff",
            },
          },
        }}
      />
      <AppProvider>
        <div
          className={`${font.className} bg-beige-100 overflow-x-hidden h-full`}
        >
          <Component {...pageProps} />
        </div>
      </AppProvider>
    </SessionProvider>
  );
}

export default MyApp;
