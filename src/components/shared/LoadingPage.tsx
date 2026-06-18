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
        <div
          role="status"
          aria-label="Loading, please wait"
          className="w-12 h-12 rounded-full border-4 border-surface-600 border-t-accent-green animate-spin"
        />
        <span className="sr-only">Loading…</span>
      </div>
    </Layout>
  );
}
