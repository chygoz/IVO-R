// lib/template-config.ts
export interface TemplateSectionConfig {
  type:
    | "hero"
    | "featured-products"
    | "categories"
    | "collections"
    | "newsletter"
    | "about"
    | "testimonials";
  enabled: boolean;
  order: number;
  props?: Record<string, any>;
}

export interface TemplateConfig {
  name: string;
  sections: TemplateSectionConfig[];
}

export const templateConfigs: Record<string, TemplateConfig> = {
  bold: {
    name: "Bold",
    sections: [
      { type: "hero", enabled: true, order: 1 },
      { type: "categories", enabled: true, order: 2 },
      {
        type: "featured-products",
        enabled: true,
        order: 3,
        props: { limit: 3 },
      },
      { type: "about", enabled: true, order: 4 },
      { type: "newsletter", enabled: true, order: 5 },
    ],
  },
  classic: {
    name: "Classic",
    sections: [
      { type: "hero", enabled: true, order: 1 },
      { type: "categories", enabled: true, order: 2 },
      {
        type: "featured-products",
        enabled: true,
        order: 3,
        props: { limit: 4 },
      },
      { type: "about", enabled: true, order: 4 },
      { type: "newsletter", enabled: true, order: 5 },
    ],
  },
  minimal: {
    name: "Minimal",
    sections: [
      { type: "hero", enabled: true, order: 1 },
      { type: "categories", enabled: true, order: 2 },
      {
        type: "featured-products",
        enabled: true,
        order: 3,
        props: { limit: 4 },
      },
      { type: "about", enabled: true, order: 4 },
      { type: "newsletter", enabled: true, order: 5 },
    ],
  },
  modern: {
    name: "Modern",
    sections: [
      { type: "hero", enabled: true, order: 1 },
      { type: "categories", enabled: true, order: 2 },
      {
        type: "featured-products",
        enabled: true,
        order: 3,
        props: { limit: 4 },
      },
      { type: "about", enabled: true, order: 4 },
      { type: "newsletter", enabled: true, order: 5 },
    ],
  },
  luxury: {
    name: "Luxury",
    sections: [
      { type: "hero", enabled: true, order: 1 },
      {
        type: "featured-products",
        enabled: true,
        order: 2,
        props: { limit: 3 },
      },
      { type: "categories", enabled: true, order: 3 },
      { type: "about", enabled: true, order: 4 },
      { type: "newsletter", enabled: true, order: 5 },
    ],
  },
};

export function getTemplateConfig(templateName: string): TemplateConfig {
  return templateConfigs[templateName] || templateConfigs.bold;
}
