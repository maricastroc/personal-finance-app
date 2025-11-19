import { CircularProgress } from "@mui/material";
import Layout from "../layouts/layout.page";
import { useAppContext } from "@/contexts/AppContext";

export function LoadingPage() {
  const { isSidebarOpen } = useAppContext();

  return (
    <Layout>
      <div
        className={`flex grow items-center justify-center w-full h-full min-h-[100vh] ${
          isSidebarOpen ? "lg:pr-10" : "lg:pr-20"
        }`}
      >
        <CircularProgress
          size="3rem"
          className="text-[#597c7c]"
          role="status"
          aria-label="Loading, please wait"
        />

        <span className="sr-only">Loading…</span>
      </div>
    </Layout>
  );
}
