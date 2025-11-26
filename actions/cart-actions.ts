// actions/cart-actions.ts
"use server";

import { cookies } from "next/headers";
import { auth } from "@/auth";
import { apiClient } from "@/lib/api/api-client";
import { revalidatePath } from "next/cache";

// Constants
const GUEST_CART_ID_COOKIE = "guest_cart_id";

// Get current cart ID from session or cookie
async function getCartId(): Promise<string | null> {
  // First try to get cart ID from authenticated session
  const session = await auth();
  if (session?.user?.cartId) {
    return session.user.cartId;
  }

  // Otherwise try to get from cookie (guest carts)
  const cookieStore = await cookies();
  return cookieStore.get(GUEST_CART_ID_COOKIE)?.value || null;
}

// Initialize or get cart
export async function getCart() {
  try {
    let cartId = await getCartId();

    // If we don't have a cart yet, initialize one
    if (!cartId) {
      // Make API call to initialize cart
      const response = await fetch(`${process.env.API_URL}/cart/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to initialize cart");
      }

      // Get cart ID from response header
      cartId = response.headers.get("X-Cart-Id");

      if (!cartId) {
        throw new Error("No cart ID returned from API");
      }

      // Store cart ID in cookie for guest users
      const session = await auth();
      if (!session) {
        (await cookies()).set(GUEST_CART_ID_COOKIE, cartId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
      }
    }

    // Now fetch the cart contents
    const cart = await apiClient.get(`/cart/${cartId}`, { requireAuth: false });
    return cart;
  } catch (error) {
    console.error("Error getting cart:", error);
    return { items: [], subtotal: 0, total: 0, isEmpty: true };
  }
}

// Add item to cart
export async function addToCart(productId: string, quantity: number) {
  try {
    const cartId = await getCartId();

    const payload = {
      productId,
      quantity,
    };

    // If we have a cartId, include it in the request
    if (cartId) {
      Object.assign(payload, { cartId });
    }

    const result = await apiClient.post("/cart/add", payload, {
      requireAuth: false,
    });

    // If no cartId yet and the response has a cart ID header, store it
    if (!cartId) {
      const newCartId = result.cartId;
      if (newCartId) {
        const session = await auth();
        if (!session) {
          (await cookies()).set(GUEST_CART_ID_COOKIE, newCartId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30, // 30 days
          });
        }
      }
    }

    // Revalidate cart-related paths
    revalidatePath("/cart");
    revalidatePath("/checkout");

    return { success: true };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to add item to cart",
    };
  }
}

// Update item quantity
export async function updateCartItem(itemId: string, quantity: number) {
  try {
    const cartId = await getCartId();

    if (!cartId) {
      throw new Error("No cart found");
    }

    await apiClient.patch(
      `/cart/${cartId}/items/${itemId}`,
      { quantity },
      { requireAuth: false }
    );

    // Revalidate cart-related paths
    revalidatePath("/cart");
    revalidatePath("/checkout");

    return { success: true };
  } catch (error) {
    console.error("Error updating cart item:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update cart",
    };
  }
}

// Remove item from cart
export async function removeCartItem(itemId: string) {
  try {
    const cartId = await getCartId();

    if (!cartId) {
      throw new Error("No cart found");
    }

    await apiClient.delete(`/cart/${cartId}/items/${itemId}`, {
      requireAuth: false,
    });

    // Revalidate cart-related paths
    revalidatePath("/cart");
    revalidatePath("/checkout");

    return { success: true };
  } catch (error) {
    console.error("Error removing cart item:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove item",
    };
  }
}

// Clear cart
export async function clearCart() {
  try {
    const cartId = await getCartId();

    if (!cartId) {
      return { success: true };
    }

    await apiClient.delete(`/cart/${cartId}`, { requireAuth: false });

    // Remove cart ID cookie for guest users
    const session = await auth();
    if (!session) {
      (await cookies()).delete(GUEST_CART_ID_COOKIE);
    }

    // Revalidate cart-related paths
    revalidatePath("/cart");
    revalidatePath("/checkout");

    return { success: true };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to clear cart",
    };
  }
}

// Merge guest cart with user cart after login
export async function mergeGuestCart() {
  try {
    const cookieStore = await cookies();
    const guestCartId = cookieStore.get(GUEST_CART_ID_COOKIE)?.value;

    // If no guest cart, nothing to merge
    if (!guestCartId) {
      return { success: true };
    }

    // Get authenticated user's cart ID
    const session = await auth();
    if (!session?.user?.cartId) {
      return { success: true };
    }

    // Make API call to merge carts
    await apiClient.post("/cart/merge", {
      guestCartId,
      userCartId: session.user.cartId,
    });

    // Clean up guest cart cookie
    cookieStore.delete(GUEST_CART_ID_COOKIE);

    // Revalidate cart-related paths
    revalidatePath("/cart");
    revalidatePath("/checkout");

    return { success: true };
  } catch (error) {
    console.error("Error merging carts:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to merge carts",
    };
  }
}
