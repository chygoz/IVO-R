import React from "react";
import PricingCard from "./pricing-card";

export const price_points = [
  {
    plan: "Basic",
    subplan: "Best for upto 200 customer ",
    price: "$300",
    renewal: "Renews Oct. 2025 for N183.3/mo (N200,000 total)",
    benefit: [
      "White-label ecommerce storefront",
      "Credit card processing",
      "24/7 support",
      "Sales and commission reports",
      "Standard buy rates, up to 20% off retail",
    ],
  },
  {
    plan: "Pro Reseller",
    subplan: "Best for unlimited customer ",
    price: "$500",
    renewal: "Renews Oct. 2025 for N187.3k/mo (N3,600,000 total)",
    benefit: [
      "White-label ecommerce storefront",
      "Credit card processing",
      "24/7 support",
      "Sales and commission reports",
      "Standard buy rates, up to 20% off retail",
    ],
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="px-0 py-6 w-full flex flex-col items-center text-center xl:px-32 xl:gap-6">
      <h2 className="text-3xl  md:text-5xl font-bold">Plans and Pricing</h2>
      <p className="text-gray-600 px-2 text-md mt-6 xl:max-w-[520px] mb-12">
        Explore our Basic and Pro Reseller plans. Choose your plan and start
        selling from your customized storefront
      </p>

      <div className="px-4 md:px-12 gap-10 grid sm:grid-cols-2  justify-center items-center">
        {price_points.map((content, index) => (
          <PricingCard
            key={index}
            plan={content.plan}
            subplan={content.subplan}
            price={content.price}
            benefit={content.benefit}
          />
        ))}
      </div>
    </section>
  );
};

export default Pricing;
