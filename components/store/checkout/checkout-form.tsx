"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store-context";
import { DHL_Product, ShippingAddress } from "@/types/shipping";
import { MapPin, Truck, CreditCard, ArrowRight, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CheckoutAddressForm } from "./checkout-address-form";
import { CheckoutShippingOptions } from "./checkout-shipping-options";
import { CheckoutOrderReview } from "./checkout-order-review";
import { CheckoutPromoCode } from "./checkout-promo-code";
import { QuickAddressSelector } from "./quick-address-selector";
import { nigerianStates } from "@/data/states";
import { countries } from "@/data/countries";
import { createAddressAction } from "@/actions/shipping-actions";
import { useAuth } from "@/contexts/auth-context";

type FormStep = "address" | "shipping" | "review" | "payment";

interface CheckoutFormProps {
  step: "shipping" | "payment" | "processing";
  shippingAddress: ShippingAddress | null;
  billingAddress: ShippingAddress | null;
  useSameAddress: boolean;
  savedAddresses: ShippingAddress[];
  cities: string[];
  shippingRates: DHL_Product[];
  selectedShippingRate: DHL_Product | null;
  isLoadingRates: boolean;
  onShippingAddressChange: (address: ShippingAddress, loadData?: boolean) => void;
  onBillingAddressChange: (address: ShippingAddress) => void;
  onUseSameAddressChange: (useSame: boolean) => void;
  onShippingRateSelect: (rate: DHL_Product) => void;
  onProceedToPayment: () => void;
  onPlaceOrder: () => void;
  isProcessing: boolean;
  items?: any[];
  subtotal?: number;
  currency?: string;
  appliedPromos?: any[];
  onApplyPromo?: (code: string) => Promise<any>;
  onRemovePromo?: (code: string) => void;
  calculateShippingRates: (address: ShippingAddress) => Promise<void>;
}

export function CheckoutForm({
  step,
  shippingAddress,
  billingAddress,
  useSameAddress,
  savedAddresses,
  cities,
  shippingRates,
  selectedShippingRate,
  isLoadingRates,
  onShippingAddressChange,
  onBillingAddressChange,
  onUseSameAddressChange,
  onShippingRateSelect,
  onProceedToPayment,
  onPlaceOrder,
  calculateShippingRates,
  isProcessing,
  items = [],
  subtotal = 0,
  currency = "NGN",
  appliedPromos = [],
  onApplyPromo,
  onRemovePromo,
}: CheckoutFormProps) {
  const { store } = useStore();
  const { colors } = store;
  const { user } = useAuth();
  const [formStep, setFormStep] = useState<FormStep>("address");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<
    "shipping" | "billing" | null
  >(null);

  const themeStyles = useMemo(
    () => ({
      primary: { backgroundColor: colors.primary },
      primaryText: { color: colors.primary },
    }),
    [colors.primary]
  );

  // Memoize handlers to prevent recreation on every render
  const handleStepForward = useCallback(() => {
    switch (formStep) {
      case "address":
        if (shippingAddress && billingAddress) {
          if (shippingRates.length > 0) {
            setFormStep("shipping");
          } else {
            calculateShippingRates(shippingAddress)
            setFormStep("shipping");
          }
        }
        break;
      case "shipping":
        if (selectedShippingRate) {
          setFormStep("review");
        }
        break;
      case "review":
        onProceedToPayment();
        break;
    }
  }, [
    calculateShippingRates,
    shippingRates,
    formStep,
    shippingAddress,
    billingAddress,
    selectedShippingRate,
    onProceedToPayment,
  ]);

  const handleStepBack = useCallback(() => {
    switch (formStep) {
      case "shipping":
        setFormStep("address");
        break;
      case "review":
        setFormStep("shipping");
        break;
    }
  }, [formStep]);

  // Address form handlers - memoized to prevent infinite renders
  const handleSaveAddress = useCallback(
    async (addressData: any, type: "change" | "create" = "change") => {
      try {
        // Convert form data to ShippingAddress
        const address: ShippingAddress = {
          _id:
            editingAddress === "shipping"
              ? shippingAddress?._id || ""
              : billingAddress?._id || "",
          firstName: addressData.firstName,
          lastName: addressData.lastName,
          email: addressData.email,
          phone: addressData.phone,
          address: addressData.address,
          street: addressData.address2,
          city: addressData.city,
          state: addressData.state,
          zip: addressData.zip,
          region: "West Africa",
          country: addressData.country,
          type: "user",
          identifier: user?.id || "",
          isDefault: (savedAddresses.length === 0 ? true : addressData.isDefault),
        };
        if ((editingAddress === "shipping" && address._id == "") || type == "create") {
          const res = await createAddressAction(address)
          if (res.success) {
            onShippingAddressChange(res.data, true);
          } else {
            throw new Error(
              res.error || "Failed to create shipping address"
            );
          }
        } else if (editingAddress === "shipping") {
          onShippingAddressChange(address);
          if (useSameAddress) {
            onBillingAddressChange(address);
          }
        } else if (editingAddress === "billing") {
          onBillingAddressChange(address);
        }

        setShowAddressForm(false);
        setEditingAddress(null);
      } catch (error) {
        console.error("Error saving address:", error);
      }
    },
    [
      editingAddress,
      shippingAddress?._id,
      billingAddress?._id,
      useSameAddress,
      onShippingAddressChange,
      onBillingAddressChange,
      user?.id,
      savedAddresses
    ]
  );

  const handleCancelAddressForm = useCallback(() => {
    setShowAddressForm(false);
    setEditingAddress(null);
  }, []);

  const handleAddNewShipping = useCallback(() => {
    setEditingAddress("shipping");
    setShowAddressForm(true);
  }, []);

  const handleAddNewBilling = useCallback(() => {
    setEditingAddress("billing");
    setShowAddressForm(true);
  }, []);

  const handleEditShipping = useCallback(() => {
    setEditingAddress("shipping");
    setShowAddressForm(true);
  }, []);

  const handleEditBilling = useCallback(() => {
    setEditingAddress("billing");
    setShowAddressForm(true);
  }, []);

  const handleEditShippingMethod = useCallback(() => {
    setFormStep("shipping");
  }, []);

  const handleEditItems = useCallback(() => {
    window.history.back();
  }, []);

  // Memoize computed values
  const canProceedFromAddress = useMemo(() => {
    return shippingAddress && billingAddress;
  }, [shippingAddress, billingAddress]);

  const canProceedFromShipping = useMemo(() => {
    return selectedShippingRate !== null;
  }, [selectedShippingRate]);

  if (step === "payment") {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Order Review */}
        {shippingAddress && billingAddress && selectedShippingRate && (
          <CheckoutOrderReview
            items={items}
            shippingAddress={shippingAddress}
            billingAddress={billingAddress}
            selectedShippingRate={selectedShippingRate}
            subtotal={subtotal}
            currency={currency}
            onEditShipping={handleEditShipping}
            onEditBilling={handleEditBilling}
            onEditShippingMethod={handleEditShippingMethod}
            onEditItems={handleEditItems}
          />
        )}

        {/* Promo Code Section */}
        {onApplyPromo && onRemovePromo && (
          <CheckoutPromoCode
            subtotal={subtotal}
            currency={currency}
            appliedPromos={appliedPromos}
            onApplyPromo={onApplyPromo}
            onRemovePromo={onRemovePromo}
          />
        )}

        {/* Payment Action */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <CreditCard className="w-5 h-5" style={themeStyles.primaryText} />
            <div>
              <p className="font-medium">Secure Payment Gateway</p>
              <p className="text-sm text-gray-600">
                You&apos;ll be redirected to complete your payment securely
              </p>
            </div>
          </div>

          <Button
            onClick={onPlaceOrder}
            disabled={isProcessing}
            className="w-full py-4 text-lg font-semibold"
            style={themeStyles.primary}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing Order...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Complete Order
              </>
            )}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Address Form Modal */}
      <AnimatePresence>
        {showAddressForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              // Close modal when clicking overlay
              if (e.target === e.currentTarget) {
                handleCancelAddressForm();
              }
            }}
          >
            <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CheckoutAddressForm
                initialAddress={
                  editingAddress === "shipping"
                    ? shippingAddress
                    : billingAddress
                }
                states={nigerianStates} // Add your states array
                countries={countries} // Add your countries array
                type={editingAddress || "shipping"}
                onSave={handleSaveAddress}
                onCancel={handleCancelAddressForm}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Multi-step Form */}
      <AnimatePresence mode="wait">
        {formStep === "address" && (
          <motion.div
            key="address"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Shipping Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5" style={themeStyles.primaryText} />
                Shipping Address
              </h3>

              <QuickAddressSelector
                addresses={savedAddresses}
                selectedAddress={shippingAddress}
                onSelect={onShippingAddressChange}
                onAddNew={handleAddNewShipping}
              />
            </div>

            {/* Billing Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CreditCard
                  className="w-5 h-5"
                  style={themeStyles.primaryText}
                />
                Billing Address
              </h3>

              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="sameAddress"
                  checked={useSameAddress}
                  onChange={(e) => onUseSameAddressChange(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="sameAddress" className="text-sm">
                  Same as shipping address
                </label>
              </div>

              {!useSameAddress && (
                <QuickAddressSelector
                  addresses={savedAddresses}
                  selectedAddress={billingAddress}
                  onSelect={onBillingAddressChange}
                  onAddNew={handleAddNewBilling}
                />
              )}
            </div>
          </motion.div>
        )}

        {formStep === "shipping" && (
          <motion.div
            key="shipping"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <CheckoutShippingOptions
              shippingRates={shippingRates}
              selectedRate={selectedShippingRate}
              onSelect={onShippingRateSelect}
              isLoading={isLoadingRates}
              currency={currency}
            />
          </motion.div>
        )}

        {formStep === "review" && (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {shippingAddress && billingAddress && selectedShippingRate && (
              <CheckoutOrderReview
                items={items}
                shippingAddress={shippingAddress}
                billingAddress={billingAddress}
                selectedShippingRate={selectedShippingRate}
                subtotal={subtotal}
                currency={currency}
                onEditShipping={() => setFormStep("address")}
                onEditBilling={() => setFormStep("address")}
                onEditShippingMethod={() => setFormStep("shipping")}
                onEditItems={handleEditItems}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        {formStep !== "address" && (
          <Button variant="outline" onClick={handleStepBack} className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}

        <Button
          onClick={handleStepForward}
          disabled={
            (formStep === "address" && !canProceedFromAddress) ||
            (formStep === "shipping" && !canProceedFromShipping)
          }
          className="flex-1"
          style={themeStyles.primary}
        >
          {formStep === "review" ? (
            <>
              Continue to Payment
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
