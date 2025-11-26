"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "./use-auth";
import { useStore } from "@/lib/store-context";
import { usePayment } from "@/providers/payment-provider";
import { useCart } from "@/providers/cart-provider";
import { ordersAPI } from "@/lib/api/orders";
import { DHL_Product, ShippingAddress } from "@/types/shipping";
import {
  getCitiesAction,
  getUserAddressesAction,
  createAddressAction,
  getShippingRatesAction,
} from "@/actions/shipping-actions";

type CheckoutStep = "shipping" | "payment" | "processing";

interface CheckoutState {
  step: CheckoutStep;
  shippingAddress: ShippingAddress | null;
  billingAddress: ShippingAddress | null;
  useSameAddress: boolean;
  savedAddresses: ShippingAddress[];
  cities: string[];
  shippingRates: DHL_Product[];
  selectedShippingRate: DHL_Product | null;
  isLoadingRates: boolean;
  isProcessingOrder: boolean;
  createdOrder: any | null;
  error: string | null;
}

export function useCheckout() {
  const { store } = useStore();
  const { user } = useAuth();
  const { totalAmount, currency } = useCart();
  const { processDirectPayment } = usePayment();

  const [state, setState] = useState<CheckoutState>({
    step: "shipping",
    shippingAddress: null,
    billingAddress: null,
    useSameAddress: true,
    savedAddresses: [],
    cities: [],
    shippingRates: [],
    selectedShippingRate: null,
    isLoadingRates: false,
    isProcessingOrder: false,
    createdOrder: null,
    error: null,
  });

  const updateState = useCallback((updates: Partial<CheckoutState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const loadUserData = useCallback(async () => {
    try {
      const response = await getUserAddressesAction();
      if (response.success) {
        const addresses = response.data;
        const defaultAddress = addresses.find((addr: any) => addr.isDefault);

        setState((currentState) => ({
          ...currentState,
          savedAddresses: addresses,
          shippingAddress: defaultAddress || null,
          billingAddress: currentState.useSameAddress
            ? defaultAddress || null
            : currentState.billingAddress,
        }));
      } else {
        updateState({ error: response.error || "Failed to load addresses" });
      }
    } catch (error) {
      updateState({
        error:
          error instanceof Error ? error.message : "Failed to load addresses",
      });
    }
  }, [updateState]);

  const calculateShippingRates = useCallback(
    async (address: ShippingAddress) => {
      if (!address.city || !address.state) return;

      updateState({ isLoadingRates: true, error: null });

      try {
        const senderAddress: ShippingAddress = {
          firstName: "Store",
          lastName: "Owner",
          email: `${store.name}@example.com`,
          address: "Store Address",
          city: "Lagos",
          state: "Lagos",
          zip: "100001",
          region: "West Africa",
          country: "Nigeria",
          phone: "+234000000000",
          type: "business",
          identifier: store.id,
          isDefault: true,
          _id: "",
        };

        const rateRequest = {
          senderAddress,
          receiverAddress: address,
          weight: 1,
          dimensions: { length: 30, width: 20, height: 10 },
          shippingId: address?._id
        };

        const response = await getShippingRatesAction(store.id, rateRequest);

        if (response.success && response.data) {
          const rates = response.data.products;
          updateState({
            shippingRates: rates,
            selectedShippingRate: rates.length > 0 ? rates[0] : null,
          });
        } else {
          updateState({
            error: response.error || "Failed to calculate shipping rates",
          });
        }
      } catch (error) {
        updateState({
          error:
            error instanceof Error
              ? error.message
              : "Failed to calculate shipping rates",
        });
      } finally {
        updateState({ isLoadingRates: false });
      }
    },
    [updateState, store.name, store.id]
  );

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    const storedOrder = sessionStorage.getItem("createdOrder");
    if (storedOrder) {
      updateState({ createdOrder: JSON.parse(storedOrder) });
      sessionStorage.removeItem("createdOrder");
    }
  }, [updateState]);

  // ✅ Fix: Use useCallback for stable action references
  const handleShippingAddressChange = useCallback(
    (address: ShippingAddress, loadData = false) => {
      setState((currentState) => ({
        ...currentState,
        shippingAddress: address,
        billingAddress: currentState.useSameAddress
          ? address
          : currentState.billingAddress,
      }));
      calculateShippingRates(address);
      if (loadData) {
        loadUserData()
      }
    },
    [calculateShippingRates, loadUserData]
  );

  const setBillingAddress = useCallback(
    (address: ShippingAddress) => {
      updateState({ billingAddress: address });
    },
    [updateState]
  );

  const setUseSameAddress = useCallback((useSame: boolean) => {
    setState((currentState) => ({
      ...currentState,
      useSameAddress: useSame,
      billingAddress: useSame
        ? currentState.shippingAddress
        : currentState.billingAddress,
    }));
  }, []);

  const setSelectedShippingRate = useCallback(
    (rate: DHL_Product) => {
      updateState({ selectedShippingRate: rate });
    },
    [updateState]
  );

  const handleProceedToPayment = useCallback(() => {
    setState((currentState) => {
      if (!currentState.shippingAddress || !currentState.selectedShippingRate) {
        return {
          ...currentState,
          error: "Please complete shipping information",
        };
      }
      return { ...currentState, step: "payment", error: null };
    });
  }, []);

  const handlePlaceOrder = useCallback(async () => {
    setState((currentState) => {
      if (
        !currentState.shippingAddress ||
        !currentState.billingAddress ||
        !currentState.selectedShippingRate
      ) {
        return {
          ...currentState,
          error: "Please complete all required information",
        };
      }
      return { ...currentState, isProcessingOrder: true, error: null };
    });

    try {
      const currentState = { ...state }; // Get current state for the async operation
      let shippingId = currentState.shippingAddress?._id;

      if (!shippingId) {
        const createResponse = await createAddressAction({
          ...currentState.shippingAddress!,
          type: "user",
          identifier: user?.id || "",
          isDefault: currentState.savedAddresses.length === 0,
        });

        if (createResponse.success && createResponse.data) {
          shippingId = createResponse.data._id;
        } else {
          throw new Error(
            createResponse.error || "Failed to create shipping address"
          );
        }
      }

      const orderResponse = await ordersAPI.createOrder({
        shippingId: shippingId!,
        businessId: store.id,
        idempotencyKey: `checkout-${Date.now()}-${user?.id}`,
      });

      if (orderResponse.success) {
        updateState({ createdOrder: orderResponse.order });
        sessionStorage.setItem("createdOrder", JSON.stringify(orderResponse.order));

        const shippingCost =
          currentState.selectedShippingRate?.totalPrice[0]?.price || 0;
        const orderTotal = totalAmount + shippingCost;

        const paymentResponse = await processDirectPayment({
          amount: orderTotal,
          currency: currency,
          customer: {
            name: `${currentState.shippingAddress!.firstName} ${currentState.shippingAddress!.lastName
              }`,
            email: currentState.shippingAddress!.email,
          },
          redirect_url: `${window.location.origin}/checkout?order=${orderResponse.order.orderId}`,
        });

        if (
          paymentResponse.status === "success" &&
          paymentResponse.data?.payment_url
        ) {
          window.location.href = paymentResponse.data.payment_url;
        } else {
          throw new Error(
            paymentResponse.error || "Failed to initiate payment"
          );
        }
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      updateState({
        error: error instanceof Error ? error.message : "Failed to place order",
      });
    } finally {
      updateState({ isProcessingOrder: false });
    }
  }, [
    state,
    updateState,
    user?.id,
    store.id,
    totalAmount,
    currency,
    processDirectPayment,
  ]);

  // ✅ Stable actions object
  const actions = useMemo(
    () => ({
      handleShippingAddressChange,
      setBillingAddress,
      setUseSameAddress,
      setSelectedShippingRate,
      handleProceedToPayment,
      handlePlaceOrder,
      calculateShippingRates
    }),
    [
      calculateShippingRates,
      handleShippingAddressChange,
      setBillingAddress,
      setUseSameAddress,
      setSelectedShippingRate,
      handleProceedToPayment,
      handlePlaceOrder,
    ]
  );

  const computed = useMemo(
    () => ({
      completedSteps: [
        ...(state.shippingAddress && state.selectedShippingRate
          ? ["shipping"]
          : []),
        ...(state.step === "payment" || state.step === "processing"
          ? ["payment"]
          : []),
      ],
      canProceedToPayment: !!(
        state.shippingAddress &&
        state.selectedShippingRate &&
        state.billingAddress
      ),
      totalWithShipping:
        totalAmount + (state.selectedShippingRate?.totalPrice[0]?.price || 0),
    }),
    [
      state.shippingAddress,
      state.selectedShippingRate,
      state.billingAddress,
      state.step,
      totalAmount,
    ]
  );

  return {
    state,
    actions,
    computed,
    updateState
  };
}
