import { ResellersResponse } from "@/actions/resellers/types";
import { StoreTheme } from "./store-context";

export function transformResellerToTheme(
  reseller: ResellersResponse
): StoreTheme {
  return {
    template: reseller.storefront.theme.template || "luxury",
    colors: {
      primary: !reseller.storefront.theme.template
        ? "#8A6D3B"
        : reseller.storefront.theme.primaryColor || "#8A6D3B",
      secondary: !reseller.storefront.theme.template
        ? "#F0EAD6"
        : reseller.storefront.theme.secondaryColor || "#F0EAD6",
      accent: !reseller.storefront.theme.template
        ? "#DFD7BF"
        : reseller.storefront.theme.accentColor || "#DFD7BF",
      background: !reseller.storefront.theme.template
        ? "#ffffff"
        : reseller.storefront.theme.backgroundColor || "#ffffff",
      text: !reseller.storefront.theme.template
        ? "#333333"
        : reseller.storefront.theme.textColor || "#333333",
    },
    logo: reseller.logo,
    name: reseller.name,
    id: reseller._id,
    headline: reseller.storefront.theme.headline,
    subtext: reseller.storefront.theme.subtext,
    banner: reseller.storefront.theme.bannerImage,
    domain: reseller.storefront.domain.subdomain,
    settings: {
      currency: reseller.storefront.settings.currency,
      showPrices: reseller.storefront.settings.showPrices,
      showStock: reseller.storefront.settings.showStock,
    },
  };
}
