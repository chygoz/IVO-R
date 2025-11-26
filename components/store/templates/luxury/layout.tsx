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

interface LuxuryLayoutProps {
  children: React.ReactNode;
  theme: StoreTheme;
}

export function LuxuryLayout({ children, theme }: LuxuryLayoutProps) {
  const { colors } = theme;

  const navigation = [
    // { label: "Collections", href: "/collections" },
    { label: "Products", href: "/products" },
    // { label: "Contact", href: "/contact" },
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
        className="py-3 text-center text-sm font-medium tracking-wider hidden md:block"
        style={{
          backgroundColor: colors.primary,
          color: colors.background,
        }}
      >
        COMPLIMENTARY SHIPPING ON ORDERS OVER $500 • PRIVATE APPOINTMENTS
        AVAILABLE
      </div>

      <header
        className="sticky top-0 z-50 backdrop-blur-md bg-opacity-95 border-b"
        style={{
          backgroundColor: `${colors.background}F5`,
          borderColor: `${colors.text}10`,
        }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex items-center"
            >
              <LogoComponent
                theme={theme}
                className="text-2xl font-serif font-light tracking-wider"
              />
            </motion.div>

            <Navigation
              theme={theme}
              navigation={navigation}
              className="hidden md:flex space-x-12"
            />

            <div className="flex items-center space-x-6">
              <SearchComponent
                theme={theme}
                className="p-2 hover:opacity-70 transition-opacity hidden md:flex"
              />

              <UserMenu
                theme={theme}
                className="p-2 hover:opacity-70 transition-opacity"
              />

              <ResponsiveCartButton
                theme={theme}
                className="p-2 hover:opacity-70 transition-opacity relative"
                desktopMode="dropdown"
                mobileMode="sidebar"
              />

              <MobileMenu theme={theme} navigation={navigation} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer
        className="py-20 border-t"
        style={{
          backgroundColor: colors.background,
          borderColor: `${colors.text}10`,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div
                className="text-2xl font-serif font-light mb-8 tracking-wider"
                style={{ color: colors.primary }}
              >
                {theme.name}
              </div>
              <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
                Creating exceptional pieces that define luxury and elegance for
                the discerning individual. Each item is a testament to our
                commitment to timeless craftsmanship.
              </p>

              <div className="flex space-x-8">
                <SocialLink href="#" colors={colors}>
                  Instagram
                </SocialLink>
                <SocialLink href="#" colors={colors}>
                  Facebook
                </SocialLink>
                <SocialLink href="#" colors={colors}>
                  Pinterest
                </SocialLink>
              </div>
            </div>

            <div>
              <div
                className="font-medium mb-8 tracking-wider text-sm"
                style={{ color: colors.primary }}
              >
                COLLECTIONS
              </div>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/products"
                    className="text-gray-600 hover:opacity-70 transition-opacity"
                  >
                    All Pieces
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/signature"
                    className="text-gray-600 hover:opacity-70 transition-opacity"
                  >
                    Signature Collection
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/limited"
                    className="text-gray-600 hover:opacity-70 transition-opacity"
                  >
                    Limited Edition
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
              </ul>
            </div>

            <div>
              <div
                className="font-medium mb-8 tracking-wider text-sm"
                style={{ color: colors.primary }}
              >
                CLIENT SERVICES
              </div>
              <ul className="space-y-4">
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
                    href="/appointments"
                    className="text-gray-600 hover:opacity-70 transition-opacity"
                  >
                    Private Appointments
                  </Link>
                </li>
                <li>
                  <Link
                    href="/care"
                    className="text-gray-600 hover:opacity-70 transition-opacity"
                  >
                    Care Instructions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/returns"
                    className="text-gray-600 hover:opacity-70 transition-opacity"
                  >
                    Returns & Exchanges
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center"
            style={{ borderColor: `${colors.text}10` }}
          >
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} {theme.name}. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0 flex space-x-8">
              <Link
                href="/privacy"
                className="text-gray-500 hover:opacity-70 transition-opacity text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-500 hover:opacity-70 transition-opacity text-sm"
              >
                Terms of Service
              </Link>
              <Link
                href="/shipping"
                className="text-gray-500 hover:opacity-70 transition-opacity text-sm"
              >
                Shipping Information
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

function SocialLink({
  href,
  children,
  colors,
}: {
  href: string;
  children: React.ReactNode;
  colors: any;
}) {
  return (
    <a
      href={href}
      className="text-sm font-medium tracking-wider hover:opacity-70 transition-opacity"
      style={{ color: colors.primary }}
    >
      {children}
    </a>
  );
}

export default LuxuryLayout;
