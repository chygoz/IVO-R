export interface Reseller {
  id: string;
  name: string;
  subdomain: string;
  isActive: boolean;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
  };
  features: string[];
  contact: {
    email: string;
    phone: string;
  };
}

// Mock data for testing
const resellers: Record<string, Reseller> = {
  reseller1: {
    id: "1",
    name: "Premium Reseller",
    subdomain: "premium",
    isActive: true,
    theme: {
      primaryColor: "#FF5733",
      secondaryColor: "#33FF57",
    },
    features: ["checkout", "inventory", "analytics"],
    contact: {
      email: "support@premium.com",
      phone: "123-456-7890",
    },
  },
  reseller2: {
    id: "2",
    name: "Budget Reseller",
    subdomain: "budget",
    isActive: true,
    theme: {
      primaryColor: "#3357FF",
      secondaryColor: "#FF3357",
    },
    features: ["checkout", "inventory"],
    contact: {
      email: "support@budget.com",
      phone: "098-765-4321",
    },
  },
  inactive: {
    id: "3",
    name: "Inactive Reseller",
    subdomain: "inactive",
    isActive: false,
    theme: {
      primaryColor: "#808080",
      secondaryColor: "#404040",
    },
    features: [],
    contact: {
      email: "support@inactive.com",
      phone: "555-555-5555",
    },
  },
};

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Get reseller by subdomain
export async function getResellerBySubdomain(
  subdomain: string
): Promise<Reseller | null> {
  // Simulate API call delay
  await delay(100);

  // Find reseller by subdomain
  const reseller = Object.values(resellers).find(
    (r) => r.subdomain === subdomain
  );

  if (!reseller) {
    return null;
  }

  return reseller;
}

// Get all active resellers
export async function getActiveResellers(): Promise<Reseller[]> {
  await delay(100);
  return Object.values(resellers).filter((r) => r.isActive);
}

// Validate if reseller exists and is active
export async function validateReseller(subdomain: string): Promise<boolean> {
  const reseller = await getResellerBySubdomain(subdomain);
  return !!(reseller && reseller.isActive);
}
