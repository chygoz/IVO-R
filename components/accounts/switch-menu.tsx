"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type SwitchMenuProps = {
  currency?: string;
};

function SwitchMenu({ currency }: SwitchMenuProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currenyCurrency, setCurrency] = React.useState(
    currency && (currency === "NGN" || currency === "USD") ? currency : "NGN"
  );

  // Update currency in state and URL
  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);

    // Create a new URLSearchParams object from the current params
    const params = new URLSearchParams(searchParams.toString());

    // Update the currency parameter
    params.set("currency", newCurrency);

    // Update the URL with the new params
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Sync state with URL if changed externally
  useEffect(() => {
    const urlCurrency = searchParams.get("currency");
    if (urlCurrency && urlCurrency !== currency) {
      setCurrency(urlCurrency);
    }
  }, [searchParams, currency]);

  const currencies = {
    NGN: {
      name: "NGN",
      icon: (
        <svg
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_5111_7731)">
            <rect x="0.5" width="16" height="16" rx="8" fill="white" />
            <mask
              id="mask0_5111_7731"
              style={{ maskType: "luminance" }}
              maskUnits="userSpaceOnUse"
              x="-3"
              y="0"
              width="22"
              height="16"
            >
              <rect x="-2.5" width="21.3333" height="16" fill="white" />
            </mask>
            <g mask="url(#mask0_5111_7731)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M-2.5 0H18.8333V16H-2.5V0Z"
                fill="#FAFDFF"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.5 0H18.8333V16H11.5V0Z"
                fill="#009933"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M-2.5 0H4.83333V16H-2.5V0Z"
                fill="#009933"
              />
            </g>
          </g>
          <defs>
            <clipPath id="clip0_5111_7731">
              <rect x="0.5" width="16" height="16" rx="8" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    USD: {
      name: "USD",
      icon: (
        <svg
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_5111_8218)">
            <rect width={16} height={16} rx={8} fill="white" />
            <g filter="url(#filter0_d_5111_8218)">
              <g clipPath="url(#clip1_5111_8218)">
                <mask
                  id="mask0_5111_8218"
                  style={{ maskType: "luminance" }}
                  maskUnits="userSpaceOnUse"
                  x={-2}
                  y={0}
                  width={21}
                  height={16}
                >
                  <rect x={-2} width="20.9231" height={16} fill="white" />
                </mask>
                <g mask="url(#mask0_5111_8218)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M-2.03125 0.130859H18.954V15.8698H-2.03125V0.130859Z"
                    fill="#F7FCFF"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M-2.03125 9.74902V11.0606H18.954V9.74902H-2.03125Z"
                    fill="#E31D1C"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M-2.03125 12.1533V13.4649H18.954V12.1533H-2.03125Z"
                    fill="#E31D1C"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M-2.03125 4.93945V6.25103H18.954V4.93945H-2.03125Z"
                    fill="#E31D1C"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M-2.03125 14.5581V15.8697H18.954V14.5581H-2.03125Z"
                    fill="#E31D1C"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M-2.03125 7.34424V8.65582H18.954V7.34424H-2.03125Z"
                    fill="#E31D1C"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M-2.03125 0.130859V1.44244H18.954V0.130859H-2.03125Z"
                    fill="#E31D1C"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M-2.03125 2.53516V3.84673H18.954V2.53516H-2.03125Z"
                    fill="#E31D1C"
                  />
                  <rect
                    x={-2}
                    width="12.9231"
                    height="8.61539"
                    fill="#2E42A5"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M-0.902515 2.05773L-1.37854 2.39145L-1.21783 1.79756L-1.64062 1.4212H-1.08839L-0.90318 0.936523L-0.686001 1.4212H-0.21524L-0.585128 1.79756L-0.441929 2.39145L-0.902515 2.05773ZM1.72068 2.05773L1.24466 2.39145L1.40537 1.79756L0.982572 1.4212H1.5348L1.72002 0.936523L1.9372 1.4212H2.40796L2.03807 1.79756L2.18127 2.39145L1.72068 2.05773ZM3.86786 2.39145L4.34388 2.05773L4.80447 2.39145L4.66127 1.79756L5.03116 1.4212H4.56039L4.34321 0.936523L4.158 1.4212H3.60577L4.02857 1.79756L3.86786 2.39145ZM6.96708 2.05773L6.49105 2.39145L6.65176 1.79756L6.22897 1.4212H6.7812L6.96641 0.936523L7.18359 1.4212H7.65435L7.28446 1.79756L7.42766 2.39145L6.96708 2.05773ZM-1.37854 5.01465L-0.902515 4.68092L-0.441929 5.01465L-0.585128 4.42076L-0.21524 4.04439H-0.686001L-0.90318 3.55972L-1.08839 4.04439H-1.64062L-1.21783 4.42076L-1.37854 5.01465ZM1.72068 4.68092L1.24466 5.01465L1.40537 4.42076L0.982572 4.04439H1.5348L1.72002 3.55972L1.9372 4.04439H2.40796L2.03807 4.42076L2.18127 5.01465L1.72068 4.68092ZM3.86786 5.01465L4.34388 4.68092L4.80447 5.01465L4.66127 4.42076L5.03116 4.04439H4.56039L4.34321 3.55972L4.158 4.04439H3.60577L4.02857 4.42076L3.86786 5.01465ZM6.96708 4.68092L6.49105 5.01465L6.65176 4.42076L6.22897 4.04439H6.7812L6.96641 3.55972L7.18359 4.04439H7.65435L7.28446 4.42076L7.42766 5.01465L6.96708 4.68092ZM-1.37854 7.63784L-0.902515 7.30412L-0.441929 7.63784L-0.585128 7.04395L-0.21524 6.66759H-0.686001L-0.90318 6.18292L-1.08839 6.66759H-1.64062L-1.21783 7.04395L-1.37854 7.63784ZM1.72068 7.30412L1.24466 7.63784L1.40537 7.04395L0.982572 6.66759H1.5348L1.72002 6.18292L1.9372 6.66759H2.40796L2.03807 7.04395L2.18127 7.63784L1.72068 7.30412ZM3.86786 7.63784L4.34388 7.30412L4.80447 7.63784L4.66127 7.04395L5.03116 6.66759H4.56039L4.34321 6.18292L4.158 6.66759H3.60577L4.02857 7.04395L3.86786 7.63784ZM6.96708 7.30412L6.49105 7.63784L6.65176 7.04395L6.22897 6.66759H6.7812L6.96641 6.18292L7.18359 6.66759H7.65435L7.28446 7.04395L7.42766 7.63784L6.96708 7.30412ZM9.11425 2.39145L9.59027 2.05773L10.0509 2.39145L9.90766 1.79756L10.2775 1.4212H9.80679L9.58961 0.936523L9.4044 1.4212H8.85216L9.27496 1.79756L9.11425 2.39145ZM9.59027 4.68092L9.11425 5.01465L9.27496 4.42076L8.85216 4.04439H9.4044L9.58961 3.55972L9.80679 4.04439H10.2775L9.90766 4.42076L10.0509 5.01465L9.59027 4.68092ZM9.11425 7.63784L9.59027 7.30412L10.0509 7.63784L9.90766 7.04395L10.2775 6.66759H9.80679L9.58961 6.18292L9.4044 6.66759H8.85216L9.27496 7.04395L9.11425 7.63784ZM0.408783 3.36933L-0.0672399 3.70305L0.0934709 3.10916L-0.329327 2.73279H0.222904L0.408118 2.24812L0.625297 2.73279H1.09606L0.72617 3.10916L0.869369 3.70305L0.408783 3.36933ZM2.55596 3.70305L3.03198 3.36933L3.49257 3.70305L3.34937 3.10916L3.71926 2.73279H3.24849L3.03132 2.24812L2.8461 2.73279H2.29387L2.71667 3.10916L2.55596 3.70305ZM5.65518 3.36933L5.17915 3.70305L5.33987 3.10916L4.91707 2.73279H5.4693L5.65451 2.24812L5.87169 2.73279H6.34245L5.97256 3.10916L6.11576 3.70305L5.65518 3.36933ZM-0.0672399 6.32624L0.408783 5.99252L0.869369 6.32624L0.72617 5.73236L1.09606 5.35599H0.625297L0.408118 4.87132L0.222904 5.35599H-0.329327L0.0934709 5.73236L-0.0672399 6.32624ZM3.03198 5.99252L2.55596 6.32624L2.71667 5.73236L2.29387 5.35599H2.8461L3.03132 4.87132L3.24849 5.35599H3.71926L3.34937 5.73236L3.49257 6.32624L3.03198 5.99252ZM5.17915 6.32624L5.65518 5.99252L6.11576 6.32624L5.97256 5.73236L6.34245 5.35599H5.87169L5.65451 4.87132L5.4693 5.35599H4.91707L5.33987 5.73236L5.17915 6.32624ZM8.27838 3.36933L7.80235 3.70305L7.96306 3.10916L7.54027 2.73279H8.0925L8.27771 2.24812L8.49489 2.73279H8.96565L8.59576 3.10916L8.73896 3.70305L8.27838 3.36933ZM7.80235 6.32624L8.27838 5.99252L8.73896 6.32624L8.59576 5.73236L8.96565 5.35599H8.49489L8.27771 4.87132L8.0925 5.35599H7.54027L7.96306 5.73236L7.80235 6.32624Z"
                    fill="#F7FCFF"
                  />
                </g>
                <rect
                  x={-2}
                  width="20.9231"
                  height={16}
                  fill="url(#paint0_linear_5111_8218)"
                  style={{ mixBlendMode: "overlay" }}
                />
              </g>
              <rect
                x="-1.67211"
                y="0.327894"
                width="20.2673"
                height="15.3442"
                rx="0.983683"
                stroke="black"
                strokeOpacity="0.1"
                strokeWidth="0.655789"
                style={{ mixBlendMode: "multiply" }}
              />
            </g>
          </g>
          <defs>
            <filter
              id="filter0_d_5111_8218"
              x="-3.96737"
              y="-0.655789"
              width="24.8576"
              height="19.9347"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1.31158" />
              <feGaussianBlur stdDeviation="0.983683" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_5111_8218"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_5111_8218"
                result="shape"
              />
            </filter>
            <linearGradient
              id="paint0_linear_5111_8218"
              x1="8.46154"
              y1={0}
              x2="8.46154"
              y2={16}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0.7" />
              <stop offset={1} stopOpacity="0.3" />
            </linearGradient>
            <clipPath id="clip0_5111_8218">
              <rect width={16} height={16} rx={8} fill="white" />
            </clipPath>
            <clipPath id="clip1_5111_8218">
              <rect
                x={-2}
                width="20.9231"
                height={16}
                rx="1.31158"
                fill="white"
              />
            </clipPath>
          </defs>
        </svg>
      ),
    },
  };

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm font-medium">Wallet</div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-gray-200 bg-white"
          >
            <div className="flex items-center gap-2">
              {currencies[currenyCurrency as "USD" | "NGN"].icon}
              <span>{currenyCurrency}</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {Object.values(currencies).map(
            (curr: { name: string; icon: React.ReactNode }) => (
              <DropdownMenuItem
                key={curr.name}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleCurrencyChange(curr.name)}
              >
                {curr.icon}
                <span>{curr.name}</span>
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default SwitchMenu;
