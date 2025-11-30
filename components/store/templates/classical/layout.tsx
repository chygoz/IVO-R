"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { StoreTheme } from "@/lib/store-context";
import {
  LogoComponent,
  SearchComponent,
  UserMenu,
  Navigation,
  MobileMenu,
} from "@/components/store/shared/header-components";
import { ResponsiveCartButton } from "@/components/store/shared/cart-button";
import { CartSidebar } from "@/components/store/shared/cart-sidebar";
import { CartLoadingOverlay } from "@/components/store/shared/cart-loading-overlay";

interface ClassicLayoutProps {
  children: React.ReactNode;
  theme: StoreTheme;
}

export function ClassicLayout({ children, theme }: ClassicLayoutProps) {
  const { colors } = theme;
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const base = `/${(pathname.split("/")[1] || "").trim()}`;

  const navigation = [
    { label: "Home", href: "/" },
    // { label: "New Arrivals", href: "/collections/new" },
    { label: "Shop All", href: "/products" },
    // { label: "Women", href: "/collections/women" },
    // { label: "Men", href: "/collections/men" },
    // { label: "Accessories", href: "/collections/accessories" },
    // { label: "About", href: "/about" },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
      }}
    >
      {/* Announcement Bar */}
      <div
        className="py-2 text-center text-sm hidden md:block"
        style={{
          backgroundColor: colors.primary,
          color: colors.background,
        }}
      >
        {/* Free shipping on orders over $100 • Easy returns within 30 days */}
      </div>

      <header>
        {/* Main Header */}
        <div className="border-b" style={{ borderColor: `${colors.text}20` }}>
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div className="w-1/4 flex justify-start">
                <div className="hidden md:flex space-x-6">
                  <SearchComponent
                    theme={theme}
                    className="text-sm hover:opacity-70 transition-opacity"
                  />
                  <Link
                    href="/contact"
                    className="text-sm hover:opacity-70 transition-opacity"
                  >
                    Contact
                  </Link>
                </div>
                <MobileMenu theme={theme} navigation={navigation} />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-2/4 flex justify-center"
              >
                <LogoComponent theme={theme} className="text-2xl font-serif" />
              </motion.div>

              <div className="w-1/4 flex justify-end space-x-4">
                <UserMenu
                  theme={theme}
                  className="hover:opacity-70 transition-opacity"
                />
                <ResponsiveCartButton
                  theme={theme}
                  className="hover:opacity-70 transition-opacity relative"
                  desktopMode="dropdown"
                  mobileMode="sidebar"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div
          className="border-b hidden md:block"
          style={{ borderColor: `${colors.text}20` }}
        >
          <div className="container mx-auto px-4">
            <Navigation
              theme={theme}
              navigation={navigation}
              className="flex justify-center space-x-10 py-4"
            />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer
        className="border-t py-12"
        style={{ borderColor: `${colors.text}20` }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div
                className="font-serif text-lg mb-4"
                style={{ color: colors.primary }}
              >
                {theme.name}
              </div>
              <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
                Classic designs for timeless style. Quality pieces that stand
                the test of time, crafted with care and attention to detail.
              </p>
            </div>

            <div>
              <div className="font-medium mb-4">Shop</div>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href={`${base}/products`}
                    className="text-gray-600 hover:opacity-70 transition-opacity"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/new"
                    className="text-gray-600 hover:opacity-70 transition-opacity"
                  >
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/bestsellers"
                    className="text-gray-600 hover:opacity-70 transition-opacity"
                  >
                    Bestsellers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/sale"
                    className="text-gray-600 hover:opacity-70 transition-opacity"
                  >
                    Sale
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-medium mb-4">Help</div>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 hover:opacity-70 transition-opacity"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping"
                    className="text-gray-600 hover:opacity-70 transition-opacity"
                  >
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-gray-600 hover:opacity-70 transition-opacity"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/size-guide"
                    className="text-gray-600 hover:opacity-70 transition-opacity"
                  >
                    Size Guide
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-medium mb-4">About</div>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:opacity-70 transition-opacity"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sustainability"
                    className="text-gray-600 hover:opacity-70 transition-opacity"
                  >
                    Sustainability
                  </Link>
                </li>
                <li>
                  <Link
                    href="/stores"
                    className="text-gray-600 hover:opacity-70 transition-opacity"
                  >
                    Store Locations
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-gray-600 hover:opacity-70 transition-opacity"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="mt-12 pt-8 border-t text-sm flex flex-col md:flex-row justify-between items-center"
            style={{ borderColor: `${colors.text}20` }}
          >
            <div className="text-gray-500">
              © {new Date().getFullYear()} {theme.name}. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link
                href="/privacy"
                className="text-gray-500 hover:opacity-70 transition-opacity"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-500 hover:opacity-70 transition-opacity"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-gray-500 hover:opacity-70 transition-opacity"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <CartSidebar />
      <CartLoadingOverlay />
    </div>
  );
}

export default ClassicLayout;
