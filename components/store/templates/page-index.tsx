import { LoadingTemplate } from "@/components/store/loading-template";
import dynamic from "next/dynamic";

// Define the template components with proper type checking
type TemplateComponent = React.ComponentType<{
  store?: any; // Update this type according to your actual store type
}>;

export const getTemplateComponent = (template: string): TemplateComponent => {
  switch (template) {
    case "minimal":
      return dynamic(() => import("@/components/store/templates/minimal"), {
        loading: () => <LoadingTemplate />,
      });
    case "luxury":
      return dynamic(() => import("@/components/store/templates/luxury"), {
        loading: () => <LoadingTemplate />,
      });
    case "modern":
      return dynamic(() => import("@/components/store/templates/modern"), {
        loading: () => <LoadingTemplate />,
      });
    case "classic":
      return dynamic(() => import("@/components/store/templates/classical"), {
        loading: () => <LoadingTemplate />,
      });
    case "bold":
      return dynamic(() => import("@/components/store/templates/bold"), {
        loading: () => <LoadingTemplate />,
      });
    default:
      return dynamic(() => import("@/components/store/templates/luxury"), {
        loading: () => <LoadingTemplate />,
      });
  }
};
