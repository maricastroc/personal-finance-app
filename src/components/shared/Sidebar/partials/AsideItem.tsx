import { Item } from "@/utils/getNavList";
import Image from "next/image";
import Link from "next/link";
import { Tooltip } from "react-tooltip";

export function AsideItem({ item, active, menuShown }: Item) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`
        flex gap-3 items-center
        focus:outline-none focus:ring-1 focus:ring-accent-green focus:ring-offset-1 focus:ring-offset-[#201f24]
        ${
          menuShown
            ? `mx-3 px-3 py-2.5 rounded-lg ${
                active
                  ? "bg-white/10 border-l-2 border-l-accent-green"
                  : "border-l-2 border-l-transparent"
              }`
            : `justify-center px-0 py-2.5 w-full ${active ? "relative" : ""}`
        }
        transition-all duration-200
        group
      `
        .replace(/\s+/g, " ")
        .trim()}
    >
      <div className={`relative h-5 w-5 shrink-0 ${!menuShown ? "" : ""}`}>
        <Image
          src={active ? item.iconActive : item.icon}
          data-tooltip-id={item.name}
          data-tooltip-content={item.name}
          alt=""
          aria-hidden="true"
          fill
          className="transition-all duration-200"
          style={{
            opacity: active ? 1 : 0.35,
            filter: "none",
          }}
        />
      </div>

      {menuShown ? (
        <p
          className={`text-xs font-medium tracking-wide transition-colors duration-200 ${
            active ? "text-white" : "text-white/40 group-hover:text-white/70"
          }`}
        >
          {item.name}
        </p>
      ) : (
        <span className="sr-only">{item.name}</span>
      )}

      <Tooltip id={item.name} place="right" className="custom-tooltip" />
    </Link>
  );
}
