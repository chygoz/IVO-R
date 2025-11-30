import Image from "next/image";
import React from "react";

type CardProps = {
  section: string;
  subSection: string;
  image: string;
  index: number;
};

const Card = ({ index, section, subSection, image }: CardProps) => {
  return (
    <div className=" h-full flex-col items-center justify-center w-full text-center md:text-start py-10 space-y-2">
      <div className="md:w-[353px] w-full h-[320px]  relative md:h-[320px] bg-gray-200 rounded-xl">
        <Image
          src={image}
          alt="device display"
          fill
          className="object-cover object-center rounded-full md:p-16 md:w-[353px] md:h-[320px]  w-full h-full"
        />
      </div>

      {/* Content Section */}
      <h2 className="xl:text-xl md:text-md sm:text-sm text-center md:text-start xl:w-full md:w-full sm:w-[57px] font-semibold w-full">
        {section}
      </h2>
      <p className="text-sm  text-center text-gray-600 w-full  md:w-[350px] md: md:text-start">
        {subSection}
      </p>
    </div>
  );
};

export default Card;
