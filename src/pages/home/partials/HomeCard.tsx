import Link from "next/link";
import { ReactNode } from "react";
import clsx from "clsx";

interface HomeCardProps {
  title: string;
  buttonLabel: string;
  children: ReactNode;
  flexGrow?: boolean;
  routePath: string;
}

export default function HomeCard({
  title,
  buttonLabel,
  children,
  routePath,
  flexGrow = false,
}: HomeCardProps) {
  return (
    <div
      className={clsx(
        "bg-white rounded-md grid gap-4 md:gap-5 mt-8 px-5 py-6 md:p-8 lg:mt-6",
        { "flex-grow": flexGrow }
      )}
    >
      <div className={clsx("flex justify-between", { "h-8": flexGrow })}>
        <h2 className="font-bold text-xl">{title}</h2>

        <Link
          href={routePath}
          aria-label={`Go to ${title} details`}
          className="
            flex items-center gap-2
            focus:outline-none focus:ring-2 focus:ring-grey-900 focus:ring-offset-2
          "
        >
          <p className="text-sm text-grey-500">{buttonLabel}</p>

          <img
            src="/assets/images/icon-caret-right.svg"
            alt=""
            aria-hidden="true"
            className="h-3 w-3"
          />
        </Link>
      </div>

      {children}
    </div>
  );
}
