import Image from "next/image";
import React from "react";

const valuesProps = [
  {
    title: "Your Brand, Your Profit",
    content:
      "Unlike traditional reseller programs, we give you the power to control your profits by setting your own prices on every product. You decide how much to earn with each sale.",
  },
  {
    title: "Seamless Selling Process",
    content:
      "Our platform simplifies upselling and cross-selling, helping you increase your sales effortlessly. We'll take care of it, boosting your income while you focus on your customers",
  },
  {
    title: "Manage Customer Accounts",
    content:
      "Gain instant access to every customer who signs up through your storefront. You can manage and monitor their orders on their behalf while building a strong relationship.",
  },
  {
    title: "Run Promotions, Get Insights",
    content:
      "Drive repeat sales with regular promotions and gain in-depth reports to understand customer behavior and maximize profits.",
  },
];

function BusinessValue() {
  return (
    <section className="pt-20 p-4 flex flex-col h-full w-full items-center justify-between text-center xl:px-32 xl:gap-20">
      {/* Content Wrapper */}
      <div className="flex  flex-col xl:flex-row items-center justify-between w-full h-auto gap-16">
        {/* Image Section */}
        <div className="flex flex-col items-start gap-8 flex-1">
          <h1 className="font-bold text-3xl md:text-5xl text-start leading-[60px] max-w-[492px]">
            It&apos;s your Business. Let it shine.
          </h1>
          <div className="grid sm:grid-cols-2 gap-10 w-full">
            <Image
              src="/business-value-1.png"
              alt="Exclusive pieces display"
              width={800}
              height={800}
              priority
              className="rounded-lg w-full sm:w-[300px] h-auto sm:h-[450px] object-cover relative sm:translate-y-[80px]"
            />

            <div className="sm:mb-[80px] w-full">
              <Image
                src="/business-value-2.png"
                alt="Exclusive pieces display"
                width={800}
                height={800}
                priority
                className="rounded-lg w-full sm:w-[300px] h-auto sm:h-[450px] object-cover"
              />
            </div>
          </div>
        </div>

        {/* Text Section */}
        <div className="flex flex-col items-start w-full h-full gap-8 flex-1">
          {valuesProps.map((value, index) => (
            <div key={index} className="bg-gray-100 rounded-xl w-full p-8">
              <p className="text-black text-start text-xl sm:text-2xl font-bold w-full mb-4">
                {value.title}
              </p>
              <p className="text-gray-700 text-start font-medium  w-full">
                {value.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BusinessValue;
