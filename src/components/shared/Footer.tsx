import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Item, navList } from "@/utils/getNavList";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function Footer() {
  const pathname = usePathname();

  const session = useSession();

  const [filteredNavList, setFilteredNavList] = useState(navList);

  useEffect(() => {
    if (session?.data?.user.email === process.env.NEXT_PUBLIC_DEMO_LOGIN) {
      const filteredNavList = navList.filter((item) => {
        return item.name !== "Profile";
      });

      setFilteredNavList(filteredNavList);
    }
  }, [session?.data?.user?.email]);

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 h-18 lg:hidden flex justify-between items-center bg-surface-900 border-t border-surface-600 px-4 pt-3 z-50"
    >
      {filteredNavList.map((item) => (
        <AsideItem
          key={item.href}
          item={item}
          active={pathname === item.href}
        />
      ))}
    </nav>
  );
}

function AsideItem({ item, active }: Item) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      aria-label={item.name}
      className={`flex flex-col gap-2
        ${
          active
            ? "bg-surface-700 border-b-2 border-b-accent-green"
            : "bg-transparent"
        }
        items-center justify-start rounded-t-lg min-w-[50px] min-h-[50px] p-2
      `}
    >
      <div className={`relative h-6 w-6 ${active ? "" : "opacity-50"}`}>
        <Image
          src={active ? item.iconActive : item.icon}
          alt=""
          role="presentation"
          fill
        />
      </div>

      <p
        className={`font-medium text-sm transition-all duration-500
          ${active ? "text-ink-50" : "text-ink-200"}
          hidden sm:block
        `}
      >
        {item.name}
      </p>
    </Link>
  );
}
