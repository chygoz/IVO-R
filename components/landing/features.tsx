import React from "react";
import Card from "./resell-card";

const features = [
  {
    title: "Build your online storefront.",
    image: "/task.png",
    subtitle:
      "Create your own branded storefront with ease. Pick a plan, customize with your logo, and start adding products from our catalog..",
  },
  {
    title: "Set your own prices.",
    image: "/data.png",
    subtitle:
      " You're in control. Add your markup to the base product price and decide your own margins.",
  },
  {
    title: "We handle your Sales",
    image: "/payment.png",
    subtitle:
      " We handle all the payment processing for you, so you can focus on growing your business.",
  },
];

const Features = () => {
  return (
    <section className="mx-0 text-balance py-6 w-full flex flex-col items-center text-center md:px-8 xl:px-32 xl:gap-6">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl xl:text-5xl font-bold leading-tight">
        Resell our products with your brand.
      </h2>

      {/* Subheading */}
      <p className="text-gray-600 text-sm md:text-base xl:text-lg mt-4 xl:max-w-[600px]">
        Create a storefront, choose products, set your prices, and grow your
        business.
      </p>

      {/* Card Grid */}
      <div className="  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 mt-8 ">
        {features.map((content, index) => (
          <Card
            index={index}
            key={index}
            section={content.title}
            subSection={content.subtitle}
            image={content.image}
          />
        ))}
      </div>
    </section>
  );
};

export default Features;
