"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store-context";
import { ShippingAddress } from "@/types/shipping";
import { getCitiesAction } from "@/actions/shipping-actions";
import {
  MapPin,
  User,
  Mail,
  Phone,
  Home,
  Save,
  X,
  Search,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AddressFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
  saveAddress: boolean;
}

interface CheckoutAddressFormProps {
  initialAddress?: ShippingAddress | null;
  states: string[];
  countries: { name: string; code: string }[];
  type: "shipping" | "billing";
  onSave: (address: AddressFormData, type?: "change" | "create") => void;
  onCancel: () => void;
  isLoading?: boolean;
  errors?: Record<string, string>;
}

export function CheckoutAddressForm({
  initialAddress,
  states,
  countries,
  type,
  onSave,
  onCancel,
  isLoading = false,
  errors = {},
}: CheckoutAddressFormProps) {
  const { store } = useStore();
  const { colors } = store;

  const initialFormData = useMemo(
    () => ({
      firstName: initialAddress?.firstName || "",
      lastName: initialAddress?.lastName || "",
      email: initialAddress?.email || "",
      phone: initialAddress?.phone || "",
      address: initialAddress?.address || "",
      city: initialAddress?.city || "",
      state: initialAddress?.state || "",
      zip: initialAddress?.zip || "",
      country: initialAddress?.country || "Nigeria",
      isDefault: initialAddress?.isDefault || true,
      saveAddress: true,
    }),
    [initialAddress]
  );

  const [formData, setFormData] = useState<AddressFormData>(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // City search state
  const [citySearch, setCitySearch] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [cityPage, setCityPage] = useState(1);
  const [cityHasMore, setCityHasMore] = useState(false);

  const themeStyles = useMemo(
    () => ({
      primary: { backgroundColor: colors.primary },
      primaryText: { color: colors.primary },
      border: { borderColor: colors.primary },
    }),
    [colors.primary]
  );

  // City search function using getCitiesAction
  const searchCities = useCallback(
    async (query: string, page: number = 1, append: boolean = false) => {
      if (!query.trim()) {
        setCities([]);
        setCityHasMore(false);
        return;
      }

      setCityLoading(true);
      try {
        const response = await getCitiesAction({
          search: query,
          page,
          limit: 20,
        });

        if (response.success) {
          if (append) {
            setCities((prev) => [...prev, ...response.data]);
          } else {
            setCities(response.data);
          }

          // Calculate if there are more pages
          const totalPages = response.meta?.totalPages || 1;
          setCityHasMore(page < totalPages);
          setCityPage(page);
        } else {
          setCities([]);
          setCityHasMore(false);
        }
      } catch (error) {
        console.error("Failed to search cities:", error);
        setCities([]);
        setCityHasMore(false);
      } finally {
        setCityLoading(false);
      }
    },
    []
  );

  // Debounced city search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (citySearch) {
        searchCities(citySearch);
      } else {
        setCities([]);
        setCityHasMore(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [citySearch, searchCities]);

  useEffect(() => {
    setFieldErrors((prev) => {
      const errorKeys = Object.keys(errors);
      const prevKeys = Object.keys(prev);

      if (errorKeys.length !== prevKeys.length) {
        return errors;
      }

      for (const key of errorKeys) {
        if (errors[key] !== prev[key]) {
          return errors;
        }
      }

      return prev;
    });
  }, [errors]);

  const handleInputChange = useCallback(
    (field: keyof AddressFormData, value: string | boolean) => {
      // Limit address field to 70 characters
      if (
        field === "address" &&
        typeof value === "string" &&
        value.length > 70
      ) {
        return;
      }

      setFormData((prev) => ({ ...prev, [field]: value }));

      setFieldErrors((prev) => {
        if (prev[field]) {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        }
        return prev;
      });
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    else if (formData.address.length > 70) {
      newErrors.address = "Address must be 70 characters or less";
    }
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    // ZIP code is now optional - no validation required

    setFieldErrors(newErrors);
    console.log(newErrors, "error")
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const isValid = validateForm()
      if (isValid) {
        onSave(formData, "create");
      } else {
        console.log(isValid)
      }
    },
    [formData, onSave, validateForm]
  );

  const loadMoreCities = useCallback(() => {
    if (cityHasMore && !cityLoading && citySearch) {
      searchCities(citySearch, cityPage + 1, true);
    }
  }, [cityHasMore, cityLoading, citySearch, cityPage, searchCities]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" style={themeStyles.primaryText} />
              {type === "shipping" ? "Shipping" : "Billing"} Address
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4" style={themeStyles.primaryText} />
                <h4 className="font-medium">Personal Information</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="Enter first name"
                    className={fieldErrors.firstName ? "border-red-500" : ""}
                  />
                  {fieldErrors.firstName && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm"
                    >
                      {fieldErrors.firstName}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="Enter last name"
                    className={fieldErrors.lastName ? "border-red-500" : ""}
                  />
                  {fieldErrors.lastName && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm"
                    >
                      {fieldErrors.lastName}
                    </motion.p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Enter email address"
                      className={`pl-10 ${fieldErrors.email ? "border-red-500" : ""
                        }`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm"
                    >
                      {fieldErrors.email}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+234 xxx xxx xxxx"
                      className={`pl-10 ${fieldErrors.phone ? "border-red-500" : ""
                        }`}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm"
                    >
                      {fieldErrors.phone}
                    </motion.p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Home className="w-4 h-4" style={themeStyles.primaryText} />
                <h4 className="font-medium">Address Information</h4>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  Street Address *
                  <span className="text-xs text-gray-500 ml-2">
                    ({formData.address.length}/70)
                  </span>
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter street address"
                  maxLength={70}
                  className={fieldErrors.address ? "border-red-500" : ""}
                />
                {fieldErrors.address && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm"
                  >
                    {fieldErrors.address}
                  </motion.p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Popover open={cityOpen} onOpenChange={setCityOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={cityOpen}
                        className={`w-full justify-between ${fieldErrors.city ? "border-red-500" : ""
                          }`}
                      >
                        {formData.city || "Search city..."}
                        <div className="flex items-center gap-1">
                          {cityLoading && (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                          )}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <div className="flex items-center border-b px-3">
                          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                          <CommandInput
                            placeholder="Search cities..."
                            value={citySearch}
                            onValueChange={setCitySearch}
                          />
                        </div>
                        <CommandEmpty>
                          {cityLoading ? "Searching..." : "No cities found."}
                        </CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                          {cities.map((city, index) => (
                            <CommandItem
                              key={`${city}-${index}`}
                              value={city}
                              onSelect={() => {
                                handleInputChange("city", city);
                                setCityOpen(false);
                                setCitySearch("");
                              }}
                            >
                              {city}
                            </CommandItem>
                          ))}
                          {cityHasMore && (
                            <CommandItem onSelect={loadMoreCities}>
                              <div className="w-full text-center py-2 text-sm text-gray-500">
                                Load more cities...
                              </div>
                            </CommandItem>
                          )}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {fieldErrors.city && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm"
                    >
                      {fieldErrors.city}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => handleInputChange("state", value)}
                  >
                    <SelectTrigger
                      className={fieldErrors.state ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldErrors.state && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm"
                    >
                      {fieldErrors.state}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    value={formData.zip}
                    onChange={(e) => handleInputChange("zip", e.target.value)}
                    placeholder="Enter ZIP code"
                    className={fieldErrors.zip ? "border-red-500" : ""}
                  />
                  {fieldErrors.zip && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm"
                    >
                      {fieldErrors.zip}
                    </motion.p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => handleInputChange("country", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Address Options */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="saveAddress"
                  checked={formData.saveAddress}
                  onCheckedChange={(checked) =>
                    handleInputChange("saveAddress", checked as boolean)
                  }
                />
                <Label htmlFor="saveAddress" className="text-sm">
                  Save this address for future use
                </Label>
              </div>

              <AnimatePresence>
                {formData.saveAddress && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center space-x-2 pl-6"
                  >
                    <Checkbox
                      id="isDefault"
                      checked={formData.isDefault}
                      onCheckedChange={(checked) =>
                        handleInputChange("isDefault", checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="isDefault"
                      className="text-sm text-gray-600"
                    >
                      Set as default address
                    </Label>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
                style={themeStyles.primary}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Address
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
