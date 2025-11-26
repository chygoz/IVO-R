"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from "react";
import { useAuth } from "@/contexts/auth-context";
import { getCookie } from "@/lib/cookie-utils";

interface CartItemVariant {
  size: {
    code: string;
    name: string;
  };
  code: string;
  hex: string;
  gallery?: { url: string; publicId: string }[];
}

interface CartItem {
  _id: string;
  productId: string;
  quantity: number;
  variant: CartItemVariant;
  price: {
    currency: string;
    value: number;
  };
  name: string;
  addedAt: string;
}

interface Cart {
  _id: string;
  userId?: string;
  businessId: string;
  temporaryId?: string;
  items: CartItem[];
  totalAmount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

interface CartState {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  actionLoading: boolean; // Separate loading for actions like add/remove
}

type CartAction =
  | { type: "SET_CART"; payload: Cart }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ACTION_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "SET_CART":
      return {
        ...state,
        cart: action.payload,
        isLoading: false,
        actionLoading: false,
        error: null,
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ACTION_LOADING":
      return { ...state, actionLoading: action.payload };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        actionLoading: false,
      };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    default:
      return state;
  }
};

interface CartContextType {
  cart: Cart | null;
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  currency: string;
  isOpen: boolean;
  isLoading: boolean;
  actionLoading: boolean;
  error: string | null;

  // Actions
  addItem: (
    productId: string,
    quantity: number,
    variantData: CartItemVariant
  ) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  switchCurrency: (currency: "NGN" | "USD") => Promise<void>;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: ReactNode;
  storeId: string;
}

export function CartProvider({ children, storeId }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: null,
    isOpen: false,
    isLoading: false,
    actionLoading: false,
    error: null,
  });

  const { isAuthenticated } = useAuth();

  // Fetch cart on mount and when auth state changes
  useEffect(() => {
    refreshCart();
    //eslint-disable-next-line
  }, [storeId, isAuthenticated]);

  const makeCartRequest = async (
    endpoint: string,
    options: RequestInit = {}
  ) => {
    const url = `/api/stores/${storeId}/cart${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // This ensures cookies are sent and received
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Request failed" }));
      throw new Error(error.message || "Request failed");
    }

    return response.json();
  };

  const refreshCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await makeCartRequest("");

      // Handle the nested cart structure from your API
      if (response.cart) {
        if (response.cart.success) {
          dispatch({ type: "SET_CART", payload: response.cart.cart });
        } else {
          dispatch({ type: "SET_CART", payload: response.cart });
        }
      } else {
        // If no cart exists, create an empty cart state
        dispatch({
          type: "SET_CART",
          payload: {
            _id: "",
            items: [],
            totalAmount: 0,
            currency: "NGN",
            businessId: storeId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error instanceof Error ? error.message : "Failed to load cart",
      });
      // Create empty cart on error
      dispatch({
        type: "SET_CART",
        payload: {
          _id: "",
          items: [],
          totalAmount: 0,
          currency: "NGN",
          businessId: storeId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }
  };

  const addItem = async (
    productId: string,
    quantity: number,
    variantData: CartItemVariant
  ) => {
    try {
      dispatch({ type: "SET_ACTION_LOADING", payload: true });
      const response = await makeCartRequest("", {
        method: "POST",
        body: JSON.stringify({
          productId,
          quantity,
          variantData,
        }),
      });
      if (response.success && response.cart) {
        dispatch({ type: "SET_CART", payload: response.cart });
        dispatch({ type: "OPEN_CART" });
      } else {
        throw new Error("Failed to add item to cart");
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error instanceof Error ? error.message : "Failed to add item",
      });
      throw error;
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      dispatch({ type: "SET_ACTION_LOADING", payload: true });
      const response = await makeCartRequest(`/items/${itemId}`, {
        method: "DELETE",
      });

      if (response.success && response.cart) {
        dispatch({ type: "SET_CART", payload: response.cart });
      } else {
        throw new Error("Failed to remove item");
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to remove item",
      });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      dispatch({ type: "SET_ACTION_LOADING", payload: true });
      const response = await makeCartRequest(`/items/${itemId}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
      });

      if (response.success && response.cart) {
        dispatch({ type: "SET_CART", payload: response.cart });
      } else {
        throw new Error("Failed to update quantity");
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to update quantity",
      });
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: "SET_ACTION_LOADING", payload: true });
      const response = await makeCartRequest("/clear", {
        method: "DELETE",
      });

      if (response.success && response.cart) {
        dispatch({ type: "SET_CART", payload: response.cart });
      } else {
        throw new Error("Failed to clear cart");
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to clear cart",
      });
    }
  };

  const switchCurrency = async (currency: "NGN" | "USD") => {
    try {
      dispatch({ type: "SET_ACTION_LOADING", payload: true });
      const response = await makeCartRequest(
        `/switch/currency?currency=${currency}`,
        {
          method: "PUT",
        }
      );

      if (response.success && response.cart) {
        dispatch({ type: "SET_CART", payload: response.cart });
      } else {
        throw new Error("Failed to switch currency");
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to switch currency",
      });
    }
  };

  const toggleCart = () => dispatch({ type: "TOGGLE_CART" });
  const openCart = () => dispatch({ type: "OPEN_CART" });
  const closeCart = () => dispatch({ type: "CLOSE_CART" });

  const contextValue: CartContextType = {
    cart: state.cart,
    items: state.cart?.items || [],
    itemCount:
      state.cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0,
    totalAmount: state.cart?.totalAmount || 0,
    currency: state.cart?.currency || "NGN",
    isOpen: state.isOpen,
    isLoading: state.isLoading,
    actionLoading: state.actionLoading,
    error: state.error,

    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    switchCurrency,
    toggleCart,
    openCart,
    closeCart,
    refreshCart,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
