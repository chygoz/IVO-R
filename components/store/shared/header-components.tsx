"use client";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useState, useRef, useEffect } from "react";
import { StoreTheme } from "@/lib/store-context";
import { useCart } from "@/providers/cart-provider";
import { getContrastingTextColor } from "@/lib/color";
interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

interface HeaderComponentsProps {
  theme: StoreTheme;
  navigation?: NavigationItem[];
}

// Logo Component
interface LogoComponentProps {
  theme: StoreTheme;
  className?: string;
}

export function LogoComponent({ theme, className }: LogoComponentProps) {
  const pathname = usePathname();
  const isPathBased = pathname?.startsWith(`/${theme.storeId}`);
  const base = isPathBased ? `/${theme.storeId}` : "";
  return (
    <Link href={base || "/"} className={`flex items-center ${className || ""}`}>
      {theme.logo ? (
        <Image
          src={theme.logo}
          alt={theme.name}
          width={120}
          height={40}
          className="h-8 w-auto object-contain"
          priority
        />
      ) : (
        <span style={{ color: getTextColor(theme) }} className="font-bold">
          {theme.name}
        </span>
      )}
    </Link>
  );
}

// Search Component
interface SearchComponentProps {
  theme: StoreTheme;
  className?: string;
}

export function SearchComponent({ theme, className }: SearchComponentProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const isPathBased = pathname?.startsWith(`/${theme.storeId}`);
  const base = isPathBased ? `/${theme.storeId}` : "";

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/stores/${theme.id}/search?q=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
    //eslint-disable-next-line
  }, [searchQuery]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <>
      <button
        onClick={() => setIsSearchOpen(true)}
        className={className || getSearchButtonClass(theme)}
        style={{ color: getIconColor(theme) }}
      >
        <SearchIcon className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-white rounded-lg w-full max-w-2xl mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 relative">
                    <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search products, categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                      style={
                        {
                          borderColor: theme.colors.primary + "30",
                          "--tw-ring-color": theme.colors.primary + "50",
                        } as any
                      }
                    />
                  </div>
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                {/* Search Results */}
                <div className="max-h-96 overflow-y-auto">
                  {isSearching ? (
                    <div className="flex items-center justify-center py-8">
                      <div
                        className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-current"
                        style={{ borderTopColor: theme.colors.primary }}
                      ></div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map((result: any, index) => (
                        <Link
                          key={index}
                          href={`${base}/products/${result.id}`}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          onClick={() => setIsSearchOpen(false)}
                        >
                          <div className="w-12 h-12 relative rounded-md overflow-hidden bg-gray-100">
                            {result.image && (
                              <Image
                                src={result.image}
                                alt={result.name}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {result.name}
                            </h4>
                            {result.price && theme.settings?.showPrices && (
                              <p
                                className="text-sm"
                                style={{ color: theme.colors.primary }}
                              >
                                {theme.settings.currency === "USD" ? "$" : "₦"}
                                {result.price}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : searchQuery && !isSearching ? (
                    <div className="text-center py-8 text-gray-500">
                      No results found for &quot;{searchQuery}&quot;
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// User Menu Component
interface UserMenuProps {
  theme: StoreTheme;
  className?: string;
}

export function UserMenu({ theme, className }: UserMenuProps) {
  const { user, isAuthenticated, isSeller, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isPathBased = pathname?.startsWith(`/${theme.storeId}`);
  const base = isPathBased ? `/${theme.storeId}` : "";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return (
      <Link
        href={`${base}/login`}
        className={className || getUserButtonClass(theme)}
        style={{ color: getIconColor(theme) }}
      >
        <UserIcon className="w-5 h-5" />
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={className || getUserButtonClass(theme)}
        style={{ color: getIconColor(theme) }}
      >
        <UserIcon className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50"
            style={{ borderColor: theme.colors.primary + "20" }}
          >
            <div className="py-2">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || user?.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              {!isSeller && (
                <>
                  <Link
                    href={`${base}/account`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    My Account
                  </Link>

                  <Link
                    href={`${base}/orders`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Order History
                  </Link>
                </>
              )}

              {isSeller && (
                <Link
                  href={`${base}/dashboard`}
                  className="block px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
                  style={{ color: theme.colors.primary }}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Go to Dashboard
                </Link>
              )}

              <div className="border-t border-gray-100 mt-2">
                <button
                  onClick={() => {
                    logout();
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface CartButtonProps {
  theme: StoreTheme;
  className?: string;
  showDropdown?: boolean; // New prop to control dropdown vs sidebar
}

export function CartButton({
  theme,
  className,
  showDropdown = false,
}: CartButtonProps) {
  const {
    toggleCart,
    openCart,
    itemCount,
    items,
    totalAmount,
    currency,
    removeItem,
    updateQuantity,
  } = useCart();
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const prevItemCount = useRef(itemCount);
  const pathname = usePathname();
  const isPathBased = pathname?.startsWith(`/${theme.storeId}`);
  const base = isPathBased ? `/${theme.storeId}` : "";

  useEffect(() => {
    if (itemCount > prevItemCount.current) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1000);
    }
    prevItemCount.current = itemCount;
  }, [itemCount]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowCartDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCartClick = () => {
    if (showDropdown) {
      setShowCartDropdown(!showCartDropdown);
    } else {
      toggleCart(); // This will open the sidebar
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={handleCartClick}
        className={className || getCartButtonClass(theme)}
        style={{ color: getIconColor(theme) }}
        animate={justAdded ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <ShoppingBagIcon className="w-5 h-5" />
        {itemCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center font-medium"
            style={{
              backgroundColor: getBadgeColor(theme),
              color: getBadgeTextColor(theme),
            }}
          >
            {itemCount > 99 ? "99+" : itemCount}
          </motion.span>
        )}

        {/* Success indicator */}
        <AnimatePresence>
          {justAdded && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-1 -left-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
            >
              <CheckIcon className="w-2 h-2 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Cart Dropdown - only show if showDropdown is true */}
      <AnimatePresence>
        {showDropdown && showCartDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50 max-h-[30rem] overflow-hidden"
            style={{ borderColor: theme.colors.primary + "20" }}
          >
            {/* Dropdown Header */}
            <div
              className="p-4 border-b"
              style={{ borderColor: `${theme.colors.text}20` }}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold" style={{ color: theme.colors.text }}>
                  Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
                </h3>
                <button
                  onClick={() => setShowCartDropdown(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <CloseIcon
                    className="w-4 h-4"
                    style={{ color: theme.colors.text }}
                  />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="max-h-64 overflow-y-auto">
              {items.length === 0 ? (
                <div className="p-6 text-center">
                  <ShoppingBagIcon
                    className="w-12 h-12 mx-auto mb-3 opacity-30"
                    style={{ color: theme.colors.text }}
                  />
                  <p
                    className="text-sm opacity-70"
                    style={{ color: theme.colors.text }}
                  >
                    Your cart is empty
                  </p>
                  <Link
                    href={`${base}/products`}
                    onClick={() => setShowCartDropdown(false)}
                    className="inline-block mt-3 text-sm font-medium"
                    style={{ color: theme.colors.primary }}
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="p-2">
                  {items.slice(0, 3).map(
                    (
                      item // Show max 3 items in dropdown
                    ) => (
                      <div
                        key={item._id}
                        className="flex gap-3 p-3 hover:bg-gray-50 rounded-lg"
                      >
                        <div className="w-12 h-12 relative rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          <div className="w-full h-full flex items-center justify-center">
                            <Image
                              src={item.variant?.gallery?.[0]?.url || "/placeholder.png"}
                              alt="Product Image"
                              width={80}
                              height={80}
                              style={{
                                objectFit: 'cover',
                                objectPosition: 'top',
                                color: theme.colors.text,
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className="text-sm font-medium truncate"
                            style={{ color: theme.colors.text }}
                          >
                            {item.name}
                          </h4>
                          <p
                            className="text-xs opacity-70"
                            style={{ color: theme.colors.text }}
                          >
                            {item.variant.size.name} • {item.variant.code}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span
                              className="text-sm font-bold"
                              style={{ color: theme.colors.primary }}
                            >
                              {currency === "USD" ? "$" : "₦"}
                              {item.price.value.toLocaleString()}
                            </span>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item._id,
                                    Math.max(1, item.quantity - 1)
                                  )
                                }
                                className="w-5 h-5 border rounded flex items-center justify-center text-xs"
                                style={{
                                  borderColor: theme.colors.primary,
                                  color: theme.colors.primary,
                                }}
                              >
                                -
                              </button>
                              <span className="text-xs w-6 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item._id, item.quantity + 1)
                                }
                                className="w-5 h-5 border rounded flex items-center justify-center text-xs"
                                style={{
                                  borderColor: theme.colors.primary,
                                  color: theme.colors.primary,
                                }}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => removeItem(item._id)}
                          className="p-1 hover:bg-red-50 rounded text-red-500"
                          title="Remove item"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  )}

                  {items.length > 3 && (
                    <div className="p-3 text-center">
                      <p
                        className="text-sm opacity-70"
                        style={{ color: theme.colors.text }}
                      >
                        +{items.length - 3} more{" "}
                        {items.length - 3 === 1 ? "item" : "items"}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dropdown Footer */}
            {items.length > 0 && (
              <div
                className="p-4 border-t"
                style={{ borderColor: `${theme.colors.text}20` }}
              >
                <div className="flex justify-between items-center mb-3">
                  <span
                    className="font-bold"
                    style={{ color: theme.colors.text }}
                  >
                    Total:
                  </span>
                  <span
                    className="font-bold"
                    style={{ color: theme.colors.primary }}
                  >
                    {currency === "USD" ? "$" : "₦"}
                    {totalAmount.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2">
                  <Link
                    href={`${base}/cart`}
                    onClick={() => setShowCartDropdown(false)}
                    className="block w-full py-2 px-3 text-center border rounded-md text-sm font-medium transition-colors"
                    style={{
                      borderColor: theme.colors.primary,
                      color: theme.colors.primary,
                    }}
                  >
                    View Cart
                  </Link>

                  <Link
                    href={`${base}/checkout`}
                    onClick={() => setShowCartDropdown(false)}
                    className="block w-full py-2 px-3 text-center rounded-md text-sm font-medium"
                    style={{
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.background,
                    }}
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Add the TrashIcon component
function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

// Navigation Component
interface NavigationProps {
  theme: StoreTheme;
  navigation?: NavigationItem[];
  className?: string;
}

export function Navigation({ theme, navigation, className }: NavigationProps) {
  const pathname = usePathname();
  const isPathBased = pathname?.startsWith(`/${theme.storeId}`);
  const base = isPathBased ? `/${theme.storeId}` : "";
  const defaultNavigation: NavigationItem[] = [
    { label: "Shop", href: `${base}/products` },
    { label: "Collections", href: `${base}/collections` },
    { label: "About", href: `${base}/about` },
    { label: "Contact", href: `${base}/contact` },
  ];

  const navItems = navigation || defaultNavigation;

  return (
    <nav className={className || "hidden md:flex space-x-6"}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={getNavLinkClass(theme)}
          style={{ color: getTextColor(theme) }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

// Mobile Menu Component
interface MobileMenuProps {
  theme: StoreTheme;
  navigation?: NavigationItem[];
}

export function MobileMenu({ theme, navigation }: MobileMenuProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user, isAuthenticated, isSeller, logout } = useAuth();

  const pathname = usePathname();
  const isPathBased = pathname?.startsWith(`/${theme.storeId}`);
  const base = isPathBased ? `/${theme.storeId}` : "";
  const defaultNavigation: NavigationItem[] = [
    { label: "Shop", href: `${base}/products` },
    { label: "Collections", href: `${base}/collections` },
    { label: "About", href: `${base}/about` },
    { label: "Contact", href: `${base}/contact` },
  ];

  const navItems = navigation || defaultNavigation;

  // Handle mounting for SSR
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isMobileMenuOpen]);

  const mobileMenuContent = (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 md:hidden"
            style={{
              zIndex: 99998,
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Mobile menu */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 md:hidden"
            style={{
              backgroundColor: theme.colors.background,
              zIndex: 99999,
              position: "fixed",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              overflow: "hidden",
            }}
          >
            <div className="p-6 h-full overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <LogoComponent theme={theme} />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-opacity-10 transition-colors"
                  style={{
                    color: theme.colors.text,
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${theme.colors.primary}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              {/* User Section */}
              {isAuthenticated ? (
                <div
                  className="mb-8 p-4 rounded-lg border"
                  style={{
                    backgroundColor: `${theme.colors.primary}05`,
                    borderColor: `${theme.colors.primary}20`,
                  }}
                >
                  <p
                    className="font-medium"
                    style={{ color: theme.colors.text }}
                  >
                    {user?.name || user?.email}
                  </p>
                  <p
                    className="text-sm opacity-70 capitalize"
                    style={{ color: theme.colors.text }}
                  >
                    {user?.role}
                  </p>
                  {isSeller && (
                    <Link
                      href={`${base}/dashboard`}
                      className="inline-block mt-2 text-sm font-medium hover:opacity-80 transition-opacity"
                      style={{ color: theme.colors.primary }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Go to Dashboard →
                    </Link>
                  )}
                </div>
              ) : (
                <div className="mb-8">
                  <Link
                    href={`${base}/login`}
                    className="block w-full py-3 px-4 rounded-lg text-center font-medium transition-all duration-300 hover:opacity-90"
                    style={{
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.background,
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </div>
              )}

              {/* Navigation */}
              <nav className="space-y-1 mb-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:translate-x-1"
                    style={{
                      color: theme.colors.text,
                      backgroundColor: "transparent",
                      fontSize: theme.template === "bold" ? "1rem" : "1.125rem",
                      fontWeight: theme.template === "bold" ? "700" : "500",
                      textTransform:
                        theme.template === "bold" ? "uppercase" : "none",
                      letterSpacing:
                        theme.template === "bold" ? "0.05em" : "normal",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${theme.colors.primary}10`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Account Links */}
              {isAuthenticated && !isSeller && (
                <div
                  className="space-y-1 border-t pt-6"
                  style={{ borderColor: `${theme.colors.text}20` }}
                >
                  <Link
                    href={`${base}/account`}
                    className="block py-2 px-4 text-sm rounded-lg transition-colors hover:bg-opacity-10"
                    style={{ color: theme.colors.text }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${theme.colors.primary}05`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <Link
                    href={`${base}/orders`}
                    className="block py-2 px-4 text-sm rounded-lg transition-colors hover:bg-opacity-10"
                    style={{ color: theme.colors.text }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${theme.colors.primary}05`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Order History
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 px-4 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}

              {/* Footer */}
              <div className="mt-auto pt-6">
                <div
                  className="text-xs text-center opacity-50"
                  style={{ color: theme.colors.text }}
                >
                  © {new Date().getFullYear()} {theme.name}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden p-2 rounded-full transition-colors relative"
        style={{
          color: getIconColor(theme),
          backgroundColor: isMobileMenuOpen
            ? `${theme.colors.primary}10`
            : "transparent",
          zIndex: 50,
        }}
      >
        {isMobileMenuOpen ? (
          <CloseIcon className="w-5 h-5" />
        ) : (
          <MenuIcon className="w-5 h-5" />
        )}
      </button>

      {/* Render mobile menu using portal to document body */}
      {isMounted &&
        typeof window !== "undefined" &&
        createPortal(mobileMenuContent, document.body)}
    </>
  );
}

// Theme-aware helper functions
function getTextColor(theme: StoreTheme): string {
  // For headers with primary background, use background color for text
  if (theme.template === "bold") {
    return theme.colors.background;
  }
  return theme.colors.text;
}

function getIconColor(theme: StoreTheme): string {
  return getContrastingTextColor(theme.colors.primary);
}

function getBadgeColor(theme: StoreTheme): string {
  return getContrastingTextColor(theme.colors.primary);
}

function getBadgeTextColor(theme: StoreTheme): string {
  return theme.colors.primary;
}

function getSearchButtonClass(theme: StoreTheme): string {
  const base = "p-2 rounded-full transition-colors";
  if (theme.template === "bold") {
    return `${base} hover:bg-white/10`;
  }
  return `${base} hover:bg-black/5`;
}

function getUserButtonClass(theme: StoreTheme): string {
  const base = "p-2 rounded-full transition-colors";
  if (theme.template === "bold") {
    return `${base} hover:bg-white/10`;
  }
  return `${base} hover:bg-black/5`;
}

function getCartButtonClass(theme: StoreTheme): string {
  const base = "p-2 rounded-full transition-colors relative";
  if (theme.template === "bold") {
    return `${base} hover:bg-white/10`;
  }
  return `${base} hover:bg-black/5`;
}

function getNavLinkClass(theme: StoreTheme): string {
  const base = "text-sm font-medium transition-opacity hover:opacity-70";
  if (theme.template === "bold") {
    return `${base} uppercase opacity-80 hover:opacity-100`;
  }
  return base;
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 1 0-16 0" />
    </svg>
  );
}

function ShoppingBagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" x2="6" y1="6" y2="18" />
      <line x1="6" x2="18" y1="6" y2="18" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20,6 9,17 4,12" />
    </svg>
  );
}
