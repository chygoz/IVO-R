"use server";

import { z } from "zod";
import { apiClient } from "@/lib/api/api-client";
import { signIn, signOut } from "@/auth";

// Login validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// Signup validation schemas
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const sellerSignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  storeName: z.string().min(2, "Store name must be at least 2 characters"),
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters")
    .max(63, "Subdomain cannot exceed 63 characters")
    .regex(/^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/, "Invalid subdomain format"),
});

// Forgot password validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

// Customer login action
export async function loginCustomer(formData: FormData) {
  // Extract and validate form data
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || "Invalid credentials",
    };
  }

  try {
    const result = await signIn("customer-login", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Authentication failed",
    };
  }
}

// Seller login action
export async function loginSeller(formData: FormData) {
  // Extract and validate form data
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || "Invalid credentials",
    };
  }

  try {
    const result = await signIn("seller-login", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.error("Seller login error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Authentication failed",
    };
  }
}

// Customer signup action
export async function signupCustomer(formData: FormData) {
  // Extract form values
  const userData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Validate form data
  const validation = signupSchema.safeParse(userData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || "Invalid input",
    };
  }

  try {
    // Create user via API client
    await apiClient.post("/auth/signup", userData, { requireAuth: false });

    // Success
    return { success: true };
  } catch (error) {
    console.error("Customer signup error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create account",
    };
  }
}

// Seller signup action
export async function signupSeller(formData: FormData) {
  // Extract form values
  const sellerData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    storeName: formData.get("storeName") as string,
    subdomain: formData.get("subdomain") as string,
  };

  // Validate form data
  const validation = sellerSignupSchema.safeParse(sellerData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || "Invalid input",
    };
  }

  try {
    // Create seller account and store via API
    // Backend expects nested structure with store object
    const requestBody = {
      name: sellerData.name,
      email: sellerData.email,
      password: sellerData.password,
      store: {
        name: sellerData.storeName,
        subdomain: sellerData.subdomain,
      },
    };

    await apiClient.post("/api/v1/auth/register/resellers", requestBody, {
      requireAuth: false,
    });

    // Success
    return { success: true };
  } catch (error) {
    console.error("Seller signup error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create account",
    };
  }
}

// Forgot password action
export async function forgotPassword({ email }: { email: string }) {
  const validation = forgotPasswordSchema.safeParse({ email });
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || "Invalid email",
    };
  }

  try {
    const res = await apiClient.post(
      "/api/v1/auth/password/forgot",
      { email },
      { requireAuth: false }
    );
    if (res.status != "ok") {
      return {
        success: false,
        error: res?.error || "Failed to reset password",
      };
    }

    return { success: true };
  } catch (error) {
    throw new Error("Failed to send password reset email");
  }
}

// Reset password action
export async function resetPassword({
  password,
  confirmPassword,
  token,
}: {
  password: string;
  confirmPassword: string;
  token: string;
}) {
  try {
    const res = await apiClient.post(
      "/api/v1/auth/password/reset",
      { token, password, confirmPassword },
      { requireAuth: false }
    );
    return { success: true };
  } catch (error) {
    throw new Error("Failed to reset password");
  }
}

// Logout action
export async function logoutUser() {
  await signOut({ redirectTo: "/" });
}
