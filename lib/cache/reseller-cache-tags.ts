export const CACHE_TAGS = {
  RESELLER_DOMAIN: (subdomain: string) => `reseller-domain-${subdomain}`,
  RESELLER_BRANDING: (businessId: string) => `reseller-branding-${businessId}`,
  RESELLER_STORE: (businessId: string) => `reseller-store-${businessId}`,
} as const;

export const generateSubdomainFromName = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, "-");
};
