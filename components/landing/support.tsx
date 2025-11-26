import Image from "next/image";
import React from "react";

function ResellerSupport() {
  return (
    <section className="px-4 md:px-20 mx-0 md:mx-24 py-4 text-wrap items-center justify-between text-center xl:flex-row xl:px-32 xl:gap-20 pb-10 w-full">
      <div className="flex-col flex-1 text-center ">
        <h2 className="text-3xl md:text-5xl md:mx-24 font-bold">
          Invisible Support, Visible Success
        </h2>
        <p className="text-gray-600 text-xl   mt-6 mb-5 max-w-[700px] mx-auto">
          All reseller stores are fully customizable and come with your branding
          front and center. We handle the logistics in the background, ensuring
          your customers only see your brand.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-12 mt-20">
        <div className="w-full flex flex-col items-start h-full justify-center text-start">
          <h1 className="font-bold text-center md:text-start text-xl sm:text-3xl mb-4">
            Build and Customize your store just in a minutes
          </h1>
          <p className="text-gray-600  sm:text-xl mt-6 xl:max-w-[520px] mb-10">
            Our platform integrates seamlessly, allowing you to access our full
            product catalog and offer a smooth shopping experience.{" "}
          </p>
        </div>

        <div className="relative w-full h-auto aspect-square  flex items-center justify-center">
          <Image
            src="/reseller-support.png"
            alt="Exclusive pieces display"
            fill
            className="rounded-xl object-cover"
          />
        </div>
      </div>

      {/* NEXT HALF */}

      <div className="grid sm:grid-cols-2 items-center gap-12 mt-20">
        {/* RIGHT */}

        <div className="relative w-full h-auto aspect-square   md:h-[496px] flex items-center justify-center ">
          <Image
            src="/reseller-support.png"
            alt="Exclusive pieces display"
            fill
            className="rounded-xl object-cover"
          />
        </div>
        <div className="w-full flex flex-col items-start h-full justify-center text-start">
          <h1 className="font-bold  pt-4 text-xl sm:text-3xl mb-4">
            Customize Your Storefront
          </h1>
          <p className="text-gray-600  mt-6 xl:max-w-[520px] sm:text-xl mb-10 w-full md:w-[650px]">
            You’ll receive a standard storefront template that you can easily
            customize to suit your business and stand out{" "}
          </p>
        </div>
      </div>
    </section>
  );
}

export default ResellerSupport;
