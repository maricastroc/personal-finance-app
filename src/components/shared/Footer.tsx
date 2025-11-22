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
      className="fixed bottom-0 left-0 right-0 h-18 lg:hidden flex justify-between items-center bg-grey-900 px-4 pt-3 z-50"
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
            ? "bg-beige-100 border-b-4 border-b-secondary-green"
            : "bg-transparent"
        }
        items-center justify-start rounded-t-xl min-w-[50px] min-h-[50px] p-2
      `}
    >
      <div className="relative h-6 w-6">
        <Image
          src={active ? item.iconActive : item.icon}
          alt=""
          role="presentation"
          fill
        />
      </div>

      <p
        className={`font-semibold text-sm transition-all duration-500
          ${active ? "text-grey-900" : "text-white"}
          hidden sm:block
        `}
      >
        {item.name}
      </p>
    </Link>
  );
}
