import { Item } from '@/utils/getNavList'
import Image from 'next/image'
import Link from 'next/link'

export function AsideItem({ item, active, menuShown }: Item) {
  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      aria-label={!menuShown ? item.name : undefined}
      className={`
        flex gap-4 hover:brightness-150 focus:outline-none
        focus:outline-2 focus:outline-white focus:outline-offset-2
        ${
          menuShown && active
            ? 'bg-beige-100 border-l-4 border-l-secondary-green'
            : 'bg-transparent'
        }
        w-[90%] items-center justify-start
        ${menuShown ? 'px-6 py-4 rounded-r-xl' : 'justify-center rounded-sm'}
        transition-all duration-500
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

      {menuShown && (
        <p
          className={`font-semibold text-base ${
            active ? 'text-gray-900' : 'text-gray-300'
          }`}
        >
          {item.name}
        </p>
      )}
    </Link>
  )
}
