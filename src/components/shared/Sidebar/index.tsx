import Image from "next/image";
import { usePathname } from "next/navigation";
import { navList } from "@/utils/getNavList";
import logo from "/public/assets/images/logo-large.svg";
import logosm from "/public/assets/images/logo-small.svg";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AsideItem } from "./partials/AsideItem";
import { SidebarToggleButton } from "./partials/SidebarToggleButton";

type navProp = {
  isSidebarOpen: boolean;
  handleIsSidebarOpen: () => void;
};

export function Sidebar({ isSidebarOpen, handleIsSidebarOpen }: navProp) {
  const pathname = usePathname();
  const session = useSession();

  const [filteredNavList, setFilteredNavList] = useState(navList);

  useEffect(() => {
    if (session?.data?.user.email === process.env.NEXT_PUBLIC_DEMO_LOGIN) {
      setFilteredNavList(navList.filter((item) => item.name !== "Profile"));
    } else {
      setFilteredNavList(navList);
    }
  }, [session?.data?.user?.email]);

  return (
    <aside
      aria-label="Main navigation sidebar"
      className={`
        fixed hidden left-0 top-0 bottom-0 bg-gray-900 rounded-r-xl lg:flex 
        flex-col justify-between py-12
        ${isSidebarOpen ? "lg:w-[240px]" : "lg:w-[88px]"}
        transition-all duration-500 z-50
      `}
    >
      <div
        className={`flex flex-col gap-20 ${
          isSidebarOpen ? "" : "justify-center items-center"
        }`}
      >
        <div
          className={`relative h-[22px] ${
            isSidebarOpen ? "ml-6 w-[121px]" : "w-[24px]"
          }`}
        >
          <Image
            src={isSidebarOpen ? logo : logosm}
            alt="Finance App logo"
            fill
          />
        </div>

        <nav
          aria-label="Main navigation"
          className={`${!isSidebarOpen && "flex flex-col gap-8"}`}
        >
          {filteredNavList.map((item, index) => (
            <AsideItem
              key={index}
              item={item}
              active={pathname === item.href}
              menuShown={isSidebarOpen}
            />
          ))}
        </nav>
      </div>

      <SidebarToggleButton
        isOpen={isSidebarOpen}
        onToggle={handleIsSidebarOpen}
      />
    </aside>
  );
}
