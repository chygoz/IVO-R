import { useState } from "react";
import Link from "next/link";
import { siteSettings } from "@/settings/site-settings";
import Scrollbar from "@/components/common/scrollbar";
import { IoIosArrowDown } from "react-icons/io";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  IoLogoInstagram,
  IoLogoTwitter,
  IoLogoFacebook,
  IoLogoYoutube,
  IoClose,
} from "react-icons/io5";
import AuthMenu from "./auth-menu";
import { Session } from "next-auth";

const social = [
  {
    id: 0,
    link: "",
    icon: <IoLogoFacebook />,
    className: "facebook",
    title: "text-facebook",
  },
  {
    id: 1,
    link: "",
    icon: <IoLogoTwitter />,
    className: "twitter",
    title: "text-twitter",
  },
  {
    id: 2,
    link: "",
    icon: <IoLogoYoutube />,
    className: "youtube",
    title: "text-youtube",
  },
  {
    id: 3,
    link: "",
    icon: <IoLogoInstagram />,
    className: "instagram",
    title: "text-instagram",
  },
];

type MobileMenuProps = {
  session: Session | null;
};
export default function MobileMenu({ session }: MobileMenuProps) {
  const [activeMenus, setActiveMenus] = useState<any>([]);
  const { site_header } = siteSettings;

  const handleArrowClick = (menuName: string) => {
    let newActiveMenus = [...activeMenus];

    if (newActiveMenus.includes(menuName)) {
      var index = newActiveMenus.indexOf(menuName);
      if (index > -1) {
        newActiveMenus.splice(index, 1);
      }
    } else {
      newActiveMenus.push(menuName);
    }

    setActiveMenus(newActiveMenus);
  };

  const ListMenu = ({
    dept,
    data,
    hasSubMenu,
    menuName,
    menuIndex,
    className = "",
  }: any) =>
    data.label && (
      <li className={`mb-0.5 ${className}`}>
        <div className="flex items-center justify-between">
          <SheetClose asChild>
            <Link
              href={data.path}
              className="w-full text-[15px] menu-item relative py-3 ps-5 md:ps-7 pe-4 transition duration-300 ease-in-out"
            >
              <span className="block w-full">{data.label}</span>
            </Link>
          </SheetClose>

          {hasSubMenu && (
            <div
              className="cursor-pointer w-16 md:w-20 h-8 text-lg flex-shrink-0 flex items-center justify-center"
              onClick={() => handleArrowClick(menuName)}
            >
              <IoIosArrowDown
                className={`transition duration-200 ease-in-out transform text-heading ${
                  activeMenus.includes(menuName) ? "-rotate-180" : "rotate-0"
                }`}
              />
            </div>
          )}
        </div>
        {hasSubMenu && (
          <SubMenu
            dept={dept}
            data={data.subMenu}
            toggle={activeMenus.includes(menuName)}
            menuIndex={menuIndex}
          />
        )}
      </li>
    );

  const SubMenu = ({ dept, data, toggle, menuIndex }: any) => {
    if (!toggle) {
      return null;
    }

    dept = dept + 1;

    return (
      <ul className="pt-0.5">
        {data?.map((menu: any, index: number) => {
          const menuName: string = `sidebar-submenu-${dept}-${menuIndex}-${index}`;

          return (
            <ListMenu
              dept={dept}
              data={menu}
              hasSubMenu={menu.subMenu}
              menuName={menuName}
              key={menuName}
              menuIndex={index}
              className={dept > 1 && "ps-4"}
            />
          );
        })}
      </ul>
    );
  };

  return (
    <>
      <Sheet>
        <SheetTrigger
          aria-label="Menu"
          className="flex md:hidden flex-col items-center justify-center 2xl:px-7 flex-shrink-0 h-full outline-none focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </SheetTrigger>
        <SheetContent>
          <div className="flex flex-col justify-start w-full h-full">
            <div className=" border-b border-gray-100 flex justify-start items-center relative  py-0 gap-6">
              {/* Logo placeholder */}
              {/* <Logo /> */}

              <div className="flex  gap-12 justify-start sm:hidden text-xs items-start ms-auto ">
                <div className="-mt-0.5 justify-start ">
                  <AuthMenu session={session} />
                </div>
              </div>

              <SheetClose
                className="flex justify-between text-2xl items-center text-gray-500 py-6 lg:py-8 focus:outline-none transition-opacity hover:opacity-60"
                aria-label="close"
              >
                <IoClose className="text-black mt-1 md:mt-0.5" />
              </SheetClose>
            </div>

            <Scrollbar className="menu-scrollbar flex-grow mb-auto">
              <div className="flex flex-col py-7 px-0 lg:px-2 text-heading">
                <ul className="mobileMenu">
                  {site_header.mobileMenu.map((menu, index) => {
                    const dept: number = 1;
                    const menuName: string = `sidebar-menu-${dept}-${index}`;

                    return (
                      <ListMenu
                        dept={dept}
                        data={menu}
                        //hasSubMenu={menu.subMenu}
                        menuName={menuName}
                        key={menuName}
                        menuIndex={index}
                      />
                    );
                  })}
                </ul>
              </div>
            </Scrollbar>

            <div className="flex items-center mt-48 justify-center bg-white border-t border-gray-100 px-7 flex-shrink-0 space-s-1">
              {social?.map((item, index) => (
                <a
                  href={item.link}
                  className={`text-heading p-5 opacity-60 first:-ms-4 transition duration-300 ease-in hover:opacity-100 ${item.className}`}
                  target="_blank"
                  key={index}
                >
                  <span className="sr-only">{item.title}</span>
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
