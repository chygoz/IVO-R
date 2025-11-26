// lib/get-cookie-domain.ts

export function getCookieDomain(hostName: string) {
  if (process.env.NODE_ENV === "development") {
    return undefined;
  }
  return hostName;
}