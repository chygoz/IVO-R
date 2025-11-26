import { removeDot } from "@/utils/remote-dot";
import { cookies } from "next/headers";

export async function setCrossDomainCookie(
  name: string,
  value: string,
  options: any = {}
) {
  const mainDomain = removeDot(
    process.env.NEXT_PUBLIC_ROOT_DOMAIN || "resellerivo.com"
  );
  const isProd = process.env.NODE_ENV === "production";

  (await cookies()).set({
    name,
    value,
    ...options,
    domain: isProd ? `.${mainDomain}` : undefined, // Dot prefix makes it work for all subdomains
    path: "/",
    secure: isProd,
    httpOnly: true,
    sameSite: "lax",
  });
}

export async function getCrossDomainCookie(name: string) {
  return (await cookies()).get(name)?.value;
}

export async function deleteCrossDomainCookie(name: string) {
  const mainDomain = removeDot(
    process.env.NEXT_PUBLIC_ROOT_DOMAIN || "resellerivo.com"
  );
  const isProd = process.env.NODE_ENV === "production";

  (await cookies()).delete({
    name,
    domain: isProd ? `.${mainDomain}` : undefined,
    path: "/",
  });
}
