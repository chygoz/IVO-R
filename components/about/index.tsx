import React from "react";
import Container from "@/components/ui/container";
import PageHeader from "../common/page-header";

function AboutComponent() {
  return (
    <Container>
      <PageHeader pageHeader="About Us" />
      <div className="py-4 flex flex-col gap-3">
        <h3 className="text-2xl font-bold">Make a Statement. Wear IVO.</h3>
        <p className="font-thin">
          IVO Stores is crafted for African creators by African creators.
          We&apos;re here to empower you to live your art, express yourself
          boldly, and join a community that celebrates culture, creativity, and
          innovation.
        </p>
      </div>
      <div className="py-4 flex flex-col gap-3">
        <h3 className="text-2xl font-bold">Our Story</h3>
        <p className="font-thin">
          IVO Stores was born when a group of creators came together with a
          vision: to celebrate the incredible creativity of African creators and
          build a community that feels like home.
        </p>
      </div>
      <div className="py-4 flex flex-col gap-3">
        <h3 className="text-2xl font-bold">
          So, what makes IVO Stores different? It&apos;s simple.{" "}
        </h3>
        <p className="font-thin">
          IVO Stores was born when a group of creators came together with a
          vision: to celebrate the incredible creativity of African creators and
          build a community that feels like home.
        </p>
      </div>
    </Container>
  );
}

export default AboutComponent;
