import Image from "next/image";
import { Button } from "../ui/button";
import Features from "./features";
import Pricing from "./pricing";
import ExploreCTA from "./explore-cta";
import BusinessValue from "./business-value";
import GrowBusiness from "./grow";
import Link from "next/link";
import ResellerSupport from "./support";

function LandingComponent() {
  return (
    <section className=" w-full px-0 md:px-0 text-center flex flex-col items-center pb-10">
      {/* Hero Section */}
      <div className="flex  flex-col items-center justify-between text-center h-full w-full md:m-14">
        <div className="max-w-[951px] mx-auto flex flex-col text-center items-center">
          {/* Animated Heading */}
          <p className="text-[#1E1E1E]  pt-16  mt-20 w-full font-medium text-3xl xl:max-w-[520px] mb-5">
            Reseller Program
          </p>
          <h2 className="text-3xl sm:text-[64px] sm:leading-[68px]  font-bold">
            Start Your Business, Sell Our Products
          </h2>
          <p className="text-gray-600 text-md mt-6 xl:max-w-[520px] mb-12">
            Launch your own business with our premium clothing catalogues.
          </p>
        </div>

        <Button className="flex items-center gap-2 bg-primary" asChild>
          <Link href="#pricing">
            Explore plans & pricing{" "}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19"
                stroke="#F7F8FA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 5L19 12L12 19"
                stroke="#F7F8FA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </Button>

        {/* Call-to-Action Button */}
        {/* <Button
          type="button"
          icon="/arrowRightDirection.svg"
          title="Get Started"
          variant="px-6 w-[170px] h-[70px]  py-3"
          bgColor="bg-primaryColor"
          hoverBgColor="bg-green-950"
          iconColour="0"
          hoverIconColour="0"
          navigateTo="/coming-soon"
        /> */}

        <div className="max-w-[1140px] mx-auto w-full mt-10">
          <div className="flex justify-center items-center bg-[#F7F8FA] py-10 rounded-[40px]  ">
            <Image
              src="/laptop.png"
              width={1000}
              height={1000}
              alt="laptop showcasing products"
              priority
              className="object-contain sm:object-cover w-[400px] h-[300px] rounded-[40px] sm:h-[600px] md:w-[960px]"
            />
          </div>
        </div>
      </div>

      {/* Sections */}
      <Features />
      <Pricing />

      <ExploreCTA />
      <BusinessValue />
      <GrowBusiness />
      <ResellerSupport />
      {/* <Discover /> */}
      {/* <ExplorePoduct /> */}
    </section>
  );
}

export default LandingComponent;
