"use client";

import CryptoJS from "crypto-js";

interface SecureAuthData {
  token: string;
  businessId?: string;
  userId?: string;
  expiresAt?: number;
}

class SecureStorage {
  private static readonly STORAGE_KEY = "auth_secure_data";
  private static readonly SECRET_KEY =
    process.env.NEXT_PUBLIC_ENCRYPTION_KEY ||
    "default-fallback-key-change-in-production";

  private static encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.SECRET_KEY).toString();
  }

  private static decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  static setAuthData(data: SecureAuthData): void {
    if (typeof window === "undefined") return;

    try {
      const dataToStore = {
        ...data,
        timestamp: Date.now(),
        expiresAt: data.expiresAt || Date.now() + 24 * 60 * 60 * 1000,
      };

      const encryptedData = this.encrypt(JSON.stringify(dataToStore));
      localStorage.setItem(this.STORAGE_KEY, encryptedData);
    } catch (error) {
      console.error("Failed to store auth data:", error);
    }
  }

  static getAuthData(): { token: string; businessId?: string } | null {
    if (typeof window === "undefined") return null;

    try {
      const encryptedData = localStorage.getItem(this.STORAGE_KEY);
      if (!encryptedData) return null;

      const decryptedData = this.decrypt(encryptedData);
      const parsedData: SecureAuthData & {
        timestamp: number;
        expiresAt: number;
      } = JSON.parse(decryptedData);

      if (parsedData.expiresAt && Date.now() > parsedData.expiresAt) {
        this.clearAuthData();
        return null;
      }

      return {
        token: parsedData.token,
        businessId: parsedData.businessId,
      };
    } catch (error) {
      console.error("Failed to retrieve auth data:", error);
      this.clearAuthData();
      return null;
    }
  }

  static clearAuthData(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static updateAuthData(updates: Partial<SecureAuthData>): void {
    const currentData = this.getAuthData();
    if (currentData) {
      this.setAuthData({ ...currentData, ...updates });
    }
  }

  static hasValidAuthData(): boolean {
    const data = this.getAuthData();
    return !!data?.token;
  }
}

export default SecureStorage;
