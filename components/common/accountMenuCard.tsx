import { Button } from "@/components/ui/button";
import { doLogout } from "@/actions/login";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { Session } from "next-auth";

type AccountMenuCardProps = {
  session: Session;
};

function AccountMenuCard({ session }: AccountMenuCardProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="cursor-pointer text-md gap-2 bg-transparent"
          variant="ghost"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.08355 21.4684C3.83317 21.9607 4.02926 22.5627 4.52153 22.8131C5.0138 23.0635 5.61583 22.8674 5.86621 22.3751L4.08355 21.4684ZM20.1338 22.3751C20.3842 22.8673 20.9862 23.0634 21.4785 22.8131C21.9707 22.5627 22.1668 21.9606 21.9164 21.4684L20.1338 22.3751ZM24 13C24 19.0751 19.0751 24 13 24V26C20.1797 26 26 20.1797 26 13H24ZM13 24C6.92487 24 2 19.0751 2 13H0C0 20.1797 5.8203 26 13 26V24ZM2 13C2 6.92487 6.92487 2 13 2V0C5.8203 0 0 5.8203 0 13H2ZM13 2C19.0751 2 24 6.92487 24 13H26C26 5.8203 20.1797 0 13 0V2ZM5.86621 22.3751C6.53581 21.0586 7.55665 19.9531 8.81572 19.1809L7.77011 17.476C6.19641 18.4411 4.92048 19.8229 4.08355 21.4684L5.86621 22.3751ZM8.81572 19.1809C10.0748 18.4087 11.523 18 13 18L13 16C11.1539 16 9.34381 16.5109 7.77011 17.476L8.81572 19.1809ZM13 18C14.477 18 15.9252 18.4087 17.1842 19.1809L18.2299 17.476C16.6561 16.5108 14.8461 16 13 16L13 18ZM17.1842 19.1809C18.4433 19.9531 19.4642 21.0586 20.1338 22.3751L21.9164 21.4684C21.0795 19.8229 19.8036 18.4411 18.2299 17.476L17.1842 19.1809ZM17 12C17 14.2091 15.2091 16 13 16V18C16.3137 18 19 15.3137 19 12H17ZM13 16C10.7908 16 9 14.2091 9 12H7C7 15.3137 9.68627 18 13 18V16ZM9 12C9 9.79086 10.7909 8 13 8V6C9.68629 6 7 8.68629 7 12H9ZM13 8C15.2091 8 17 9.79086 17 12H19C19 8.68629 16.3137 6 13 6V8Z"
              fill="currentColor"
            />
          </svg>

          <div className="text-start capitalize text-xs">
            <p>Welcome</p>
            <div className="flex items-center gap-4">
              <p className="text-ellipsis">{session?.user.name}</p>{" "}
              <svg
                width="10"
                height="5"
                viewBox="0 0 10 5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.75 0.5L5 4.25L1.25 0.5"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 mx-2">
        <ul className="flex flex-col font-thin p-4">
          <li>
            <Link onClick={() => setOpen(false)} className="" href="/account">
              Profile
            </Link>
          </li>
          <li>
            <Link
              onClick={() => setOpen(false)}
              className=""
              href="/account/orders"
            >
              Orders
            </Link>
          </li>
          <li>
            <Link
              onClick={() => setOpen(false)}
              className=""
              href="/account/payment-history"
            >
              Payment History
            </Link>
          </li>

          <Separator />
          <li>
            <form action={() => doLogout(pathname)}>
              <button
                className="hover:bg-transparent w-full p-0 text-left font-thin flex justify-start text-base"
                type="submit"
              >
                Logout
              </button>
            </form>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export default AccountMenuCard;
