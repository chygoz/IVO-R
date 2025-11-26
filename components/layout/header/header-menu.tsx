import Link from "next/link";
import MegaMenu from "@/components/ui/mega-menu";
import { cn } from "@/lib/utils";
import ListMenu from "@/components/ui/list-menu";

interface MenuProps {
  data: any;
  className?: string;
}

const HeaderMenu: React.FC<MenuProps> = ({ data, className }) => {
  return (
    <nav className={cn(`headerMenu flex w-full relative`, className)}>
      {data?.map((item: any) => (
        <div
          className={`menuItem group cursor-pointer py-7 ${
            item.subMenu ? "relative" : ""
          }`}
          key={item.id}
        >
          <Link
            href={item.path}
            className="inline-flex uppercase items-center text-xs xl:text-xs text-white px-3 xl:px-4 py-2 relative group-hover:text-black"
          >
            {item.label}
          </Link>

          {item?.columns && Array.isArray(item.columns) && (
            <MegaMenu columns={item.columns} />
          )}

          {item?.subMenu && Array.isArray(item.subMenu) && (
            <div className="subMenu shadow-header bg-gray-200 absolute start-0 opacity-0 group-hover:opacity-100">
              <ul className="text-body text-sm py-5">
                {item.subMenu.map((menu: any, index: number) => {
                  const dept: number = 1;
                  const menuName: string = `sidebar-menu-${dept}-${index}`;

                  return (
                    <ListMenu
                      dept={dept}
                      data={menu}
                      hasSubMenu={menu.subMenu}
                      menuName={menuName}
                      key={menuName}
                      menuIndex={index}
                    />
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default HeaderMenu;
