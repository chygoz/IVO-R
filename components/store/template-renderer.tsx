"use client";

import { useStore } from "@/lib/store-context";
import { getTemplateConfig } from "@/lib/template-config";
import {
  HeroSection,
  FeaturedProductsSection,
  CategoriesSection,
  NewsletterSection,
  AboutSection,
} from "@/components/store/shared/template-sections";

export function TemplateRenderer() {
  const { store } = useStore();
  const templateConfig = getTemplateConfig(store.template);

  const renderSection = (sectionType: string, props?: Record<string, any>) => {
    const style = store.template as
      | "bold"
      | "classic"
      | "minimal"
      | "modern"
      | "luxury";

    switch (sectionType) {
      case "hero":
        return <HeroSection key={sectionType} style={style} />;
      case "featured-products":
        return (
          <FeaturedProductsSection key={sectionType} style={style} {...props} />
        );
      case "categories":
        return <CategoriesSection key={sectionType} style={style} />;
      case "newsletter":
        return <NewsletterSection key={sectionType} style={style} />;
      case "about":
        return <AboutSection key={sectionType} style={style} />;
      default:
        return null;
    }
  };

  const enabledSections = templateConfig.sections
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <div>
      {enabledSections.map((section) =>
        renderSection(section.type, section.props)
      )}
    </div>
  );
}
