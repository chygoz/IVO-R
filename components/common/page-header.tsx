import { cn } from "@/lib/utils";
interface HeaderProps {
  pageSubHeader?: string;
  pageHeader: string;
  bgImg?: string;
}

const PageHeader: React.FC<HeaderProps> = ({
  pageSubHeader,
  pageHeader,
  bgImg,
}) => {
  return (
    <div
      className="flex justify-center p-6 md:p-10 2xl:p-8 relative bg-no-repeat bg-center bg-cover"
      style={{
        backgroundImage: `url(${
          bgImg ? bgImg : ""
        })`,
      }}
    >
      <div className="absolute top-0 start-0 bg-black w-full h-full opacity-50 transition-opacity duration-500 group-hover:opacity-80" />
      <div className="w-full flex items-center justify-center relative z-10 py-10 md:py-14 lg:py-20 xl:py-24 2xl:py-32">
        <h2
          className={cn(
            "text-2xl md:text-3xl font-belleza lg:text-4xl uppercase text-white text-center"
          )}
        >
          {pageSubHeader && (
            <span className="text-xs md:text-sm block font-normal mb-3">
              {pageSubHeader}
            </span>
          )}
          {pageHeader}
        </h2>
      </div>
    </div>
  );
};

export default PageHeader;
