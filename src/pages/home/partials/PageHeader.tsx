import { PageTitle } from "@/components/shared/PageTitle";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

export const PageHeader = () => {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    toast?.success("See you soon!");
  };

  return (
    <header className="flex items-center justify-between w-full mb-8">
      <PageTitle
        title="Overview"
        description="A quick look at your accounts, pots, budgets, bills, and recent transactions."
      />

      <button
        onClick={handleLogout}
        type="button"
        className="font-semibold rounded-md p-3 px-4 flex gap-2 items-center transition-all duration-300 max-h-[60px] text-sm bg-grey-900 text-beige-100 hover:bg-grey-500"
      >
        <FontAwesomeIcon icon={faRightToBracket} />
        Logout
      </button>
    </header>
  );
};
