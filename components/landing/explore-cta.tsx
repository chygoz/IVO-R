import Image from "next/image";
import React from "react";

const attributes = [
  { name: "Trusted Product", imageUrl: "/mark.png" },
  { name: "Verified Suppliers", imageUrl: "/premium.svg" },
  { name: "Trade Assurances", imageUrl: "/star.svg" },
];

const ExploreCTA = () => {
  return (
    <section className="text-balance px-2 md:px-4 py-20 mt-10 relative isolate bg-primary w-full items-center h-full  md:h-[450px] justify-center  text-center md:flex-row  xl:gap-20  ">
      <Image
        src="/design.png"
        alt="Exclusive pieces display"
        fill
        className="w-full object-cover object-center z-[-1]"
      />

      <div className="flex flex-col gap-5 max-w-[633px] mx-auto">
        <h2 className="px-4 text-[20px] md:text-[40px] text-white font-bold">
          Explore Unlimited Fashion All In One Place.
        </h2>

        <div className="flex flex-col sm:flex-row justify-center  items-center">
          {attributes.map((attribute, index) => {
            return (
              <div
                key={index}
                className="flex w-fit items-center gap-3 rounded-xl"
              >
                <Image
                  width={100}
                  height={100}
                  src={attribute.imageUrl}
                  alt={attribute.name}
                  className="object-cover rounded-full w-full !size-[16px] !md:size-[24px]"
                />
                <p className="text-white font-medium">{attribute.name}</p>
              </div>
            );
          })}
        </div>

        <div className="  md:px-12 flex flex-col w-full md:gap-3 sm:flex-row justify-center items-center mt-8">
          {/* <Button
          type="button"
          title="Get Started"
          iconColour="0"
          icon="/arrowRightDirection.svg"
          hoverIconColour="0"
          bgColor="bg-white"
          variant="w-[100px] md:w-[165px] h-[60px] md:h-[70px] rounded-xl "
          navigateTo="https://ivostores.com/"
        /> */}
        </div>
      </div>
    </section>
  );
};

export default ExploreCTA;
