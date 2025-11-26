import { redirect } from "next/navigation";
import { auth } from "@/auth";

// Check if user is authenticated
export async function isAuthenticated() {
  const session = await auth();
  return !!session;
}

// Check if user is a seller
export async function isSeller() {
  const session = await auth();
  return session?.user?.role === "seller";
}

// Check if user is a customer
export async function isCustomer() {
  const session = await auth();
  return session?.user?.role === "customer";
}

// Route protection middleware
export async function requireAuth(redirectTo = "/login") {
  const session = await auth();
  if (!session) {
    redirect(redirectTo);
  }
  return session;
}

// Require seller authentication
export async function requireSellerAuth(redirectTo = "/seller/login") {
  const session = await auth();
  if (!session || session.user.role !== "seller") {
    redirect(redirectTo);
  }
  return session;
}

// Require customer authentication
export async function requireCustomerAuth(redirectTo = "/login") {
  const session = await auth();
  if (!session || session.user.role !== "customer") {
    redirect(redirectTo);
  }
  return session;
}
