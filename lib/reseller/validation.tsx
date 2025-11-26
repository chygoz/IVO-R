import { cache } from "react";
import { cookies } from "next/headers";
import { Reseller } from "@/types/reseller";
import { getResellerBySubdomain } from "@/data/resellers";

export class ResellerError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = "ResellerError";
  }
}

export const getResellerInfo = cache(
  async (domain: string): Promise<Reseller> => {
    try {
      // In production, this would fetch from  reseller management service/database
      const reseller = await getResellerBySubdomain(domain);

      if (!reseller) {
        throw new ResellerError("Reseller not found", "RESELLER_NOT_FOUND");
      }

      // Validate tenant status
      if (!reseller.isActive) {
        throw new ResellerError("Reseller is not active", "RESELLER_INACTIVE");
      }

      return reseller;
    } catch (error) {
      // Log the error with proper error tracking
      console.error("Reseller validation error:", error);
      throw error;
    }
  }
);
