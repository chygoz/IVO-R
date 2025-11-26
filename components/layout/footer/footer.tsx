import Widgets from "./widgets";
import Copyright from "./copyright";
import { footer } from "./data";
const { widgets } = footer;

const Footer: React.FC = () => (
  <footer className="p-4 sm:p-12 overflow-hidden border-b-4 border-heading mt-9 md:mt-11 lg:mt-16 3xl:mt-20 pt-2.5 lg:pt-0 2xl:pt-2">
    <Widgets widgets={widgets} />
    <Copyright  />
  </footer>
);

export default Footer;
