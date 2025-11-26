import React from "react";
import Widgets from "../footer/widgets";
import Copyright from "../footer/copyright";
import { footer } from "../footer/data";
const { widgets } = footer;

function Footer() {
  return (
    <footer className="p-4 sm:p-12 overflow-hidden border-b-4 border-heading mt-9 md:mt-11 lg:mt-16 3xl:mt-20 pt-2.5 lg:pt-0 2xl:pt-2">
      <Widgets widgets={widgets} />
      <Copyright />
    </footer>
  );
}

export default Footer;
