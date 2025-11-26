export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordChangeResponse {
  success: boolean;
  message: string;
}

export type UserType = "customer" | "seller" | undefined;

export type OnboardingStep =
  | "password-change"
  | "agreement"
  | "subscription"
  | "welcome"
  | "completed";

export interface AuthUser {
  name: string;
  email: string;
  image: string | null;
  picture: string | null;
  sub: string;
  id: string;
  role: UserType;
  token: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  phone: string;
  passwordDefault: boolean;
  businessId: string;
  businessName: string;
  businessRole: string;
  businessType: "reseller-internal" | "reseller-external";
  subdomain: string;
  agreementSigned: boolean;
  onboardingComplete: boolean;
  subscription: {
    id: string;
    status: string;
    planName: string;
    planId: string;
    expiryDate: Date;
    renewalDate: Date;
    isAutoRenew: boolean;
    price: number;
    currency: "NGN" | "USD";
  };
  onboardingStatus: {
    completed: boolean;
    currentStep: OnboardingStep;
    passwordChanged: boolean;
    agreementSigned: boolean;
    subscriptionActive: boolean;
  };
}
