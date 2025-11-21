import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export const PageHeader = () => {
  const session = useSession();

  const router = useRouter();

  const isDemoUser =
    session?.data?.user?.email === process.env.NEXT_PUBLIC_DEMO_LOGIN;

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    toast?.success("See you soon!");
  };

  return (
    <header className="flex items-center justify-between w-full mb-8">
      <h1 className="text-gray-900 font-bold text-3xl">Overview</h1>

      <button
        onClick={isDemoUser ? () => router.push("/") : handleLogout}
        type="button"
        className="font-semibold rounded-md p-3 px-4 flex gap-2 items-center transition-all duration-300 max-h-[60px] text-sm bg-gray-900 text-beige-100 hover:bg-gray-500"
      >
        <FontAwesomeIcon icon={faRightToBracket} />
        {isDemoUser ? "Login" : "Logout"}
      </button>
    </header>
  );
};
