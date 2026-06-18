import { PrimaryButton } from "@/components/core/PrimaryButton";
import { PageTitle } from "@/components/shared/PageTitle";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export const PageHeader = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    toast.success("See you soon!");
    router.push("/auth/login");
  };

  return (
    <header className="flex items-center justify-between w-full mb-8">
      <PageTitle
        title="Overview"
        description="Manage your accounts, budgets and savings goals"
      />

      <PrimaryButton
        onClick={handleLogout}
        className="mt-0 max-w-[8rem] text-sm"
      >
        <LogOut size={14} />
        Logout
      </PrimaryButton>
    </header>
  );
};
