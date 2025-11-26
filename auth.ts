import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { getCookieDomain } from "./lib/get-cookie-domain";
import { cookies } from "next/headers";

const rawNextUrl =
  process.env.NEXTAUTH_URL ||
  process.env.AUTH_URL ||
  process.env.VERCEL_URL ||
  "";
const normalizedNextUrl = (() => {
  if (!rawNextUrl) return "http://localhost:3000";
  if (!/^https?:\/\//i.test(rawNextUrl)) return `https://${rawNextUrl}`;
  return rawNextUrl;
})();
const useSecureCookies =
  process.env.NODE_ENV === "production" &&
  normalizedNextUrl.startsWith("https://");
const cookiePrefix = useSecureCookies ? "__Secure-" : "";
const hostName = new URL(normalizedNextUrl).hostname;

// Server-side environment variables
const API_URL = process.env.SERVER_API_URL;

interface BaseLoginResponse {
  status?: string;
  token?: string;
  message: string;
  success: boolean;
}

interface ResellerData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  type: "reseller";
  avatar: string;
  phone?: string;
  passwordDefault: boolean;
  emailVerified: boolean;
  business: {
    identifier: string;
    name: string;
    role: string;
    businessType: string;
    subdomain: string;
    signed: boolean;
    onboardingComplete: boolean;
    subscription?: {
      id: string;
      status: string;
      planName: string;
      planId: string;
      expiryDate: string;
      renewalDate: string;
      isAutoRenew: boolean;
      price: number;
      currency: string;
    };
  };
}

interface CustomerData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  type: "customer";
  avatar: string;
  phone?: string;
  emailVerified: boolean;
}

interface ResellerLoginResponse extends BaseLoginResponse {
  data?: ResellerData;
  token?: string;
}

interface CustomerLoginResponse extends BaseLoginResponse {
  data?: CustomerData;
  token?: string;
}

type LoginResponse = ResellerLoginResponse | CustomerLoginResponse;

async function login(
  credentials: Record<"email" | "password", string>,
  cartId = ""
): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cartId ? { Cookie: `cartId=${encodeURIComponent(cartId)}` } : {}),
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data: LoginResponse = await response.json();

    if (response.ok && data.status === "ok") {
      return { ...data, success: true, token: data.token || "" };
    }

    return { message: data.message, success: false };
  } catch (error) {
    console.error("Login error:", error);
    return { message: "Authentication failed", success: false };
  }
}
export async function register(data: Record<string, any>): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/api/v1/auth/register/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, type: "customer" }),
    });
    const json: LoginResponse = await response.json();

    if (response.ok && json.status === "ok") {
      return { success: true };
    }
    return { message: json.message, success: false };
  } catch (error) {
    console.error("Registration error:", error);
    return { message: "Registration failed", success: false };
  }
}

export const { auth, handlers, signIn, signOut, unstable_update } = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      //@ts-expect-error
      async authorize(credentials) {
        const cartId = (await cookies()).get("cartId")?.value || "";
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Make a single call to your API
        //@ts-expect-error
        const loginResult = await login(credentials, cartId);

        if (!loginResult?.success || !loginResult.data) {
          throw new Error(loginResult?.message);
        }

        const { data, token } = loginResult;

        // Check if the user is a reseller or customer
        const isReseller = data.type === "reseller";

        // Create the base user object for the session
        const user = {
          id: data.id,
          email: data.email,
          name: `${data.firstName} ${data.lastName}`,
          image: data.avatar || null,
          role: isReseller ? "seller" : "customer",
          token: token,
          firstName: data.firstName,
          lastName: data.lastName,
          emailVerified: data.emailVerified,
          phone: data.phone || null,
        };

        // If the user is a reseller, add business info
        if (isReseller && "business" in data) {
          // Type assertion to access ResellnerData properties
          const resellerData = data as ResellerData;

          Object.assign(user, {
            passwordDefault: resellerData.passwordDefault,
            businessId: resellerData.business.identifier,
            businessName: resellerData.business.name,
            businessRole: resellerData.business.role,
            businessType: resellerData.business.businessType,
            subdomain: resellerData.business.subdomain,
            agreementSigned: resellerData.business.signed,
            onboardingComplete: resellerData.business.onboardingComplete,
            subscription: resellerData.business.subscription,
            onboardingStatus: {
              completed: true,
              currentStep: "",
              passwordChanged: !resellerData.passwordDefault,
              agreementSigned: resellerData.business.signed,
              subscriptionActive:
                resellerData.business.subscription?.status === "active",
            },
          });

          // Determine current onboarding step if not complete
          if (!resellerData.business.onboardingComplete) {
            // Default to password change if using default password
            let currentStep = resellerData.passwordDefault
              ? "password-change"
              : "agreement";

            // If password is changed but agreement not signed
            if (
              !resellerData.passwordDefault &&
              !resellerData.business.signed
            ) {
              currentStep = "agreement";
            }

            // If agreement signed but external reseller needs subscription
            if (
              !resellerData.passwordDefault &&
              resellerData.business.signed &&
              resellerData.business.businessType === "reseller-external" &&
              (!resellerData.business.subscription ||
                resellerData.business.subscription.status !== "active")
            ) {
              currentStep = "subscription";
            }

            // If all previous steps done but onboarding not complete
            if (
              !resellerData.passwordDefault &&
              resellerData.business.signed &&
              (resellerData.business.businessType === "reseller-internal" ||
                (resellerData.business.subscription &&
                  resellerData.business.subscription.status === "active"))
            ) {
              currentStep = "welcome";
            }

            Object.assign(user, {
              onboardingStatus: {
                completed: false,
                currentStep: currentStep,
                passwordChanged: !resellerData.passwordDefault,
                agreementSigned: resellerData.business.signed,
                subscriptionActive:
                  resellerData.business.subscription?.status === "active",
              },
            });
          }
        }

        return user;
      },
    }),
  ],
  callbacks: {
    // Add token and user info to JWT
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: JWT;
      user: any;
      trigger?: string;
      session?: any;
    }) {
      if (user) {
        // Add all user properties to the token
        Object.assign(token, user);
      }

      // This is the key part for session updates - handle the update trigger
      if (trigger === "update" && session) {
        // Update the token with the new session data
        return { ...token, ...session.user };
      }

      return token;
    },
    // Add user info to session
    async session({ session, token }: { session: any; token: JWT }) {
      // Add all token properties to the session.user
      session.user = { ...session.user, ...token };
      // But remove jwt-specific fields
      delete session.user.iat;
      delete session.user.exp;
      delete session.user.jti;

      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: getCookieDomain(hostName),
        secure: useSecureCookies,
      },
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day (match your token expiry)
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});
