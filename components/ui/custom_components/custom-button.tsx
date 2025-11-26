"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ButtonProps {
  type: "button" | "submit";
  title: string | any;
  icon?: string;
  variant: string;
  full?: boolean;
  iconColour?: string;
  hoverIconColour?: string;
  navigateTo?: string;
  bgColor?: string;
  disabled?: boolean;
  hoverBgColor?: string;
  onClick?: () => void; // <-- Add this
}

const Button: React.FC<ButtonProps> = ({
  type,
  title,
  icon,
  variant,
  full = false,
  iconColour = "2",
  hoverIconColour = "2",
  navigateTo,
  disabled,
  bgColor = "bg-primary",
  hoverBgColor = "bg-white",
  onClick, // <-- Accept onClick
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (navigateTo) {
      router.push(navigateTo);
    }
    if (onClick) {
      onClick(); // <-- Call the onClick function if provided
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      type={type}
      className={cn(
        `group flex items-center justify-center gap-3 rounded-md ${bgColor}  ${full ? "w-full" : ""
        } transition-all duration-300 ease-in-out w-40 h-12 px-6 py-3 text-lg hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${variant} `
      )}
      aria-label={title}
    >
      <span className={`text-lg  font-semibold whitespace-nowrap `}>
        {title}
      </span>

      {icon && (
        <Image
          src={icon}
          alt={`${title} icon`}
          width={24}
          height={24}
          className="transform transition-transform duration-300 group-hover:scale-125"
          style={{
            filter: `invert(${iconColour === "0" && iconColour > "0" && iconColour > ""
                ? iconColour
                : hoverIconColour
              })`,
          }}
        />
      )}
    </button>
  );
};

export default Button;
