import React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { FiSearch } from "react-icons/fi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

type AppSearchProps = {
  className?: string;
};

const AppSearch: React.FC<AppSearchProps> = ({ className }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace, push } = useRouter();

  const handleSearch = useDebouncedCallback((value: string) => {
    const param = new URLSearchParams(searchParams);

    if (value.trim()) {
      param.set("query", value.trim());
      // push(``)
    } else {
      param.delete("query");
    }

    push(`/storefront?${param.toString()}`);
  }, 300);

  return (
    <div className={cn("relative w-full max-w-sm sm:max-w-md lg:max-w-xl", className)}>
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-4 flex items-center text-gray-500">
        <FiSearch className="h-5 w-5" />
      </div>

      {/* Search Input */}
      <Input
        type="text"
        placeholder="Search here..."
        aria-label="Search"
        className="w-full pl-12 pr-4 py-3 rounded-full    text-gray-900 text-md bg-white shadow-sm sm:text-lg md:text-xl"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query") || ""}
      />
    </div>
  );
};

export default AppSearch;
