import { FC } from "react";
import Image from "next/image";

interface BannerProps {
  banner: any;
  variant?: "rounded" | "default";
  effectActive?: boolean;
  className?: string;
  classNameInner?: string;
}

const BannerCard: FC<BannerProps> = ({
  banner,
  className,
  variant = "rounded",
  classNameInner,
}) => {
  const { image, title } = banner;
  return (
    <div
      style={{
        backgroundColor: `#090909`,
        width: "100%",
        height: "100%",
        position: "absolute",
      }}
      className="flex flex-col justify-center"
    >
      <Image
        className="block md:hidden"
        src={image.mobile.url}
        alt={title}
        quality={100}
        width={image.mobile.width}
        height={image.mobile.height}
      />

      <Image
        className="hidden md:block"
        src={image.desktop.url}
        alt={title}
        quality={100}
        width={image.desktop.width}
        height={image.desktop.height}
      />
    </div>
  );
};

export default BannerCard;
