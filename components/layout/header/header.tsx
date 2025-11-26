"use client";
import React, { useRef } from "react";
import { useAddActiveScroll } from "@/utils/add-active-scroll";
import { Session } from "next-auth";
import { cn } from "@/lib/utils";

type HeaderProps = {
  session: Session | null;
  reseller: string | null;
};

type DivElementRef = React.MutableRefObject<HTMLDivElement>;

const Header = ({ session, reseller }: HeaderProps) => {
  const siteHeaderRef = useRef<HTMLDivElement>(null!);
  useAddActiveScroll(siteHeaderRef);

  return (
    <header
      id="siteHeader"
      ref={siteHeaderRef}
      className="w-full fixed items-center z-[50]"
    >
      <div
        className={cn(
          "bg-white text-[var(--primary-color)]",
          "flex w-full body-font h-[var(--nav-height-mobile)] sm:h-[var(--nav-height-tablet)] lg:h-[var(--nav-height-desktop)] transition items-center  duration-200 ease-in-out"
        )}
      ></div>
    </header>
  );
};

export default Header;
