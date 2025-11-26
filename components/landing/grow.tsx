import React from "react";

function GrowBusiness() {
  return (
    <div className="max-w-[1140px] mx-auto my-[60px]  p-[30px] md:p-[60px] rounded-xl w-full bg-[#F9F9FB] justify-center items-center">
      <div className="grid sm:grid-cols-2 gap-7">
        <h2 className="text-2xl  md:text-[40px] w-full text-start font-bold">
          Grow your sales and expand your business{" "}
        </h2>

        <div className="justify-start">
          <p className="text-black text-start w-full mb-12">
            Take your business to the next level with a comprehensive Digital
            Marketing & Sales Training. Learn proven strategies to increase your
            online presence, attract more customers, and boost your revenue.
          </p>
          {/* <Button
              type="submit"
              title="Learn More"
              icon="/arrowRightDirection.svg"
              iconColour="0"
              navigateTo="coming-soon"
              hoverIconColour="0"
              variant="px-6 md:w-[170px] h-[70px]  py-3"
              bgColor="bg-primaryColor"
            /> */}
        </div>
      </div>
    </div>
  );
}

export default GrowBusiness;
