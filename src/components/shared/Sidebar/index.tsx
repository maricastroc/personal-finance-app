import Image from "next/image";
import { usePathname } from "next/navigation";
import { navList } from "@/utils/getNavList";
import logo from "/public/assets/images/logo-large.svg";
import logosm from "/public/assets/images/logo-small.svg";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AsideItem } from "./partials/AsideItem";
import { SidebarToggleButton } from "./partials/SidebarToggleButton";
import { ProfileModal } from "@/components/shared/ProfileModal";
import { Tooltip } from "react-tooltip";
import userIcon from "/public/assets/images/user-solid.svg";
import userIconActive from "/public/assets/images/user-solid-active.svg";

type navProp = {
  isSidebarOpen: boolean;
  handleIsSidebarOpen: () => void;
};

export function Sidebar({ isSidebarOpen, handleIsSidebarOpen }: navProp) {
  const pathname = usePathname();
  const session = useSession();

  const [filteredNavList, setFilteredNavList] = useState(navList);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    setFilteredNavList(navList.filter((item) => item.name !== "Profile"));
  }, [session?.data?.user?.email]);

  return (
    <aside
      aria-label="Main navigation sidebar"
      className={`
        fixed hidden left-0 top-0 bottom-0 lg:flex
        flex-col justify-between py-12
        backdrop-blur-xl
        ${isSidebarOpen ? "lg:w-[240px]" : "lg:w-[88px]"}
        transition-all duration-500 z-50
      `}
      style={{
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-border)",
      }}
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

        <nav aria-label="Main navigation" className={`flex flex-col gap-4`}>
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

      <div
        className={`flex flex-col gap-4 ${
          isSidebarOpen ? "px-6" : "items-center px-0"
        }`}
      >
        <button
          onClick={() => setIsProfileOpen(true)}
          aria-label="Open profile"
          data-tooltip-id="profile-btn"
          data-tooltip-content="Profile"
          className={`
            flex gap-3 items-center w-full
            focus:outline-2 focus:outline-accent-green focus:outline-offset-1
            ${
              isSidebarOpen
                ? "mx-[-0.75rem] px-3 py-2.5 rounded-lg border-l-2 border-l-transparent hover:bg-white/5"
                : "justify-center px-0 py-2.5"
            }
            transition-all duration-200 group
          `}
        >
          <div className="relative h-5 w-5 shrink-0">
            <Image
              src={isProfileOpen ? userIconActive : userIcon}
              alt=""
              aria-hidden="true"
              fill
              style={{ opacity: isProfileOpen ? 1 : 0.35 }}
            />
          </div>
          {isSidebarOpen ? (
            <p className="text-xs font-medium tracking-wide text-white/40 group-hover:text-white/70 transition-colors duration-200">
              Profile
            </p>
          ) : (
            <>
              <span className="sr-only">Profile</span>
              <Tooltip
                id="profile-btn"
                place="right"
                className="custom-tooltip"
              />
            </>
          )}
        </button>

        <SidebarToggleButton
          isOpen={isSidebarOpen}
          onToggle={handleIsSidebarOpen}
        />
      </div>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </aside>
  );
}
