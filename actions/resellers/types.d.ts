import { User } from "../users/types";

export interface StoreFront {
  _id: string;
  name: string;
  logo: "";
  state?: string;
  address?: string;
  phone?: string;
  signedAgreement?: boolean;
  businessType: "reseller-internal";
  businessKey: string;
  owner: User;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  shipping: {
    address: string;
    country: string;
    zipcode: string;
    city: string;
  };
  storefront: {
    _id: string;
    businessId: string;
    domain: {
      sslCertificate: {
        status: "pending" | "";
      };
      subdomain: string;
      isCustomDomainVerified: boolean;
      _id: string;
    };
    theme: {
      primaryColor: string;
      secondaryColor: string;
      bannerImage: string;
      accentColor: string;
      backgroundColor: string;
      textColor: string;
      headline: string;
      subtext: string;
      template: string;
      _id: string;
    };
    seo: {
      title: string;
      description: string;
      keywords: [];
      _id: string;
    };
    state: string;
    address: string;
    country: string;
    settings: {
      isEnabled: boolean;
      showPrices: boolean;
      allowGuestCheckout: boolean;
      requireLogin: boolean;
      showStock: boolean;
      currency: "USD" | "NGN";
      language: "en";
      timezone: "UTC";
      _id: string;
    };
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface ResellersResponse extends StoreFront {}
