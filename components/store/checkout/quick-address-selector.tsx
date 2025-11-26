"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store-context";
import { MapPin, Plus, Check } from "lucide-react";
import { ShippingAddress } from "@/types/shipping";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface QuickAddressSelectorProps {
  addresses: ShippingAddress[];
  selectedAddress: ShippingAddress | null;
  onSelect: (address: ShippingAddress) => void;
  onAddNew: () => void;
}

export function QuickAddressSelector({
  addresses,
  selectedAddress,
  onSelect,
  onAddNew,
}: QuickAddressSelectorProps) {
  const { store } = useStore();
  const { colors } = store;
  const [isExpanded, setIsExpanded] = useState(false);

  const themeStyles = useMemo(
    () => ({
      primary: { backgroundColor: colors.primary },
      primaryText: { color: colors.primary },
      border: { borderColor: colors.primary },
    }),
    [colors.primary]
  );

  const handleAddressSelect = useCallback(
    (address: ShippingAddress) => {
      onSelect(address);
      setIsExpanded(false);
    },
    [onSelect]
  );

  const handleToggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const otherAddresses = useMemo(() => {
    return addresses.filter((addr) => addr._id !== selectedAddress?._id);
  }, [addresses, selectedAddress?._id]);

  if (addresses.length === 0) {
    return (
      <Button
        onClick={onAddNew}
        variant="outline"
        className="w-full p-4 h-auto"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Shipping Address
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      {/* Selected Address Display */}
      {selectedAddress && (
        <Card className="border-2" style={themeStyles.border}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <MapPin
                  className="w-5 h-5 mt-0.5"
                  style={themeStyles.primaryText}
                />
                <div>
                  <p className="font-medium">
                    {selectedAddress.firstName} {selectedAddress.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedAddress.address}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedAddress.city}, {selectedAddress.state}{" "}
                    {selectedAddress.zip}
                  </p>
                </div>
              </div>
              <Check className="w-5 h-5" style={themeStyles.primaryText} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Address Options */}
      {otherAddresses.length > 0 && (
        <Button
          variant="outline"
          onClick={handleToggleExpanded}
          className="w-full"
        >
          {isExpanded ? "Hide" : "Choose"} Other Addresses (
          {otherAddresses.length})
        </Button>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {otherAddresses.map((address) => (
              <motion.div
                key={address._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleAddressSelect(address)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                      <div>
                        <p className="font-medium text-sm">
                          {address.firstName} {address.lastName}
                        </p>
                        <p className="text-xs text-gray-600">
                          {address.address}
                        </p>
                        <p className="text-xs text-gray-600">
                          {address.city}, {address.state}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add New Address */}
      <Button
        onClick={onAddNew}
        variant="ghost"
        className="w-full"
        style={themeStyles.primaryText}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add New Address
      </Button>
    </div>
  );
}
