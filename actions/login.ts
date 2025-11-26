"use server";
import { auth, signIn, signOut, register } from "@/auth";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function doLogout(pathname: string) {
  await signOut();
}
export async function doRegister(formData: any) {
  return await register(formData);
}
export async function doCredentialLogin(
  formData: any,
  type?: "create" | "login"
) {
  try {
    return await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      ...(type && type === "create"
        ? {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            phone: formData.get("phone"),
          }
        : {}),
      redirect: false,
    });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    if (error instanceof Error) {
      //@ts-expect-error fix
      if (error?.cause?.err instanceof Error) {
        return {
          //@ts-expect-error fix
          error: error.cause?.err.message,
        };
      }
      return {
        error: error.message,
      };
    }

    if (error instanceof AuthError) {
      if (error.cause?.err instanceof Error) {
        return {
          error: error?.cause?.err?.message,
        };
      }
    }
    return {
      error: "something went wrong",
    };
  }
}
