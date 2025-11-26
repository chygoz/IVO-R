import Image from "next/image";
import React from "react";

type PlanCardProps = {
  plan: string;
  subplan: string;
  price: string;
  benefit: string[];
  // renewal: string;
};

const PricingCard = ({ plan, subplan, price, benefit }: PlanCardProps) => {
  return (
    <div className="w-full md:w-[580px] h-auto rounded-xl bg-gray-100 px-2 py-4 md:p-8 flex flex-col justify-between items-start space-y-6">
      {/* Plan Info */}
      <div className="w-full text-start rounded-xl bg-white p-8 space-y-4">
        <p className="text-xl font-semibold">{plan}</p>
        <p className="text-sm text-gray-600">{subplan}</p>
        <div className="flex items-end space-x-2">
          <p className="text-5xl font-bold">{price}</p>
          <span>/yr</span>
        </div>
        {/* <p className="text-sm text-gray-600">{renewal}</p> */}
        {/* <Button
          type="submit"
          title="Get Started"
          navigateTo="/Pages/ComingSoon"
          variant="w-full h-[70px] rounded-xl bg-green-950 text-white"
        /> */}
      </div>

      {/* Benefit List */}
      <div className="w-full space-y-3">
        {benefit.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 text-start text-md font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>

            <p className="text-black">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingCard;
