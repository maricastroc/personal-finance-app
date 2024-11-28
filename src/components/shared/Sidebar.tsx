import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Item, navList } from '@/utils/getNavList'
import logo from '../../../public/assets/images/logo-large.svg'
import logosm from '../../../public/assets/images/logo-small.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons'

type navProp = {
  isSidebarOpen: boolean
  handleIsSidebarOpen: () => void
}

export function Sidebar({ isSidebarOpen, handleIsSidebarOpen }: navProp) {
  const pathname = usePathname()

  return (
    <aside
      className={`fixed left-0  top-0 bottom-0 bg-gray-900 rounded-r-xl lg:flex flex-col justify-between py-12 ${
        isSidebarOpen ? 'lg:w-[240px]' : 'lg:w-[88px]'
      } transition-all duration-500 hidden z-50`}
    >
      <div
        className={`flex flex-col gap-20 ${
          isSidebarOpen ? '' : 'justify-center items-center'
        }`}
      >
        <div
          className={`relative h-[22px] ${
            isSidebarOpen ? 'ml-6 w-[121px] ' : ' w-[24px]'
          }`}
        >
          <Image src={isSidebarOpen ? logo : logosm} alt="logo image" fill />
        </div>

        <div>
          {navList.map((item, index) => (
            <AsideItem
              key={index}
              item={item}
              active={pathname === item.href}
              menuShown={isSidebarOpen}
            />
          ))}
        </div>
      </div>
      <button
        className={`flex ${isSidebarOpen ? 'ml-6' : 'ml-4'} gap-3 items-center`}
        onClick={handleIsSidebarOpen}
      >
        <FontAwesomeIcon
          icon={isSidebarOpen ? faCaretLeft : faCaretRight}
          className="text-gray-300"
          style={{ fontSize: '1.5rem', marginLeft: `${isSidebarOpen ? 0 : 20}` }}
        />
        <p
          className={`text-gray-300 font-semibold text-sm transition-all duration-500 ${
            isSidebarOpen ? 'flex' : 'hidden'
          }`}
        >
          Minimize Menu
        </p>
      </button>
    </aside>
  )
}

function AsideItem({ item, active, menuShown }: Item) {
  return (
    <Link
      href={item.href}
      className={`flex gap-4 hover:brightness-150 ${
        menuShown && active
          ? 'bg-beige-100 border-l-4 border-l-secondary-green'
          : 'bg-transparent'
      } w-[90%] h-14 items-center justify-start rounded-r-xl ${
        menuShown ? 'px-6 py-4 ' : 'justify-center items-center'
      } `}
    >
      <div className="relative h-6 w-6">
        <Image
          src={active ? item.iconActive : item.icon}
          alt="Icon image"
          fill
        />
      </div>
      <p
        className={`font-semibold text-base ${
          active ? 'text-gray-900' : 'text-gray-300'
        } ${menuShown ? 'flex' : 'hidden'} transition-all duration-500`}
      >
        {item.name}
      </p>
    </Link>
  )
}
