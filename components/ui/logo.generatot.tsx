import React, { useState, useEffect } from "react";
import { createAvatar } from "@dicebear/core";
import { shapes } from "@dicebear/collection";
import Image from "next/image";

type LogoGeneratorProps = {
  name: string;
  color: string;
};

const LogoGenerator = ({ name, color }: LogoGeneratorProps) => {
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    const generateLogo = async () => {
      const avatar = createAvatar(shapes, {
        seed: name,
        backgroundColor: [color],
        shape1: ["rectangle", "ellipse", "polygon"],
        shape2: ["rectangleFilled", "ellipseFilled", "polygonFilled"],
        shape3: ["line", "polygon", "ellipse"],
      });

      const dataUri = await avatar.toDataUri();
      setLogoUrl(dataUri);
    };

    generateLogo();
  }, [name, color]);

  return (
    <div className="flex flex-col sm:flex-row items-center sm:gap-4">
      {logoUrl ? (
        <>
          <Image
            src={logoUrl}
            width={800}
            height={800}
            alt={`Logo for ${name}`}
            className="size-[40px] rounded-lg shadow-none"
          />
          <p className="text-lg  font-semibold text-gray-700 capitalize">
            {name}
          </p>
        </>
      ) : (
        <div className="size-[40px] rounded-lg shadow-lg bg-gray-200 animate-pulse" />
      )}
    </div>
  );
};

export default LogoGenerator;
