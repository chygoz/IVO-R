"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

interface MinimalLayoutProps {
  children: React.ReactNode;
  theme: StoreTheme;
}

export function MinimalLayout({ children, theme }: MinimalLayoutProps) {
  const { colors } = theme;
  const pathname = usePathname();
  const isPathBased = pathname?.startsWith(`/${theme.storeId}`);
  const base = isPathBased ? `/${theme.storeId}` : "";

  const navigation = [
    { label: "Shop", href: `${base}/products` },
    // { label: "Collections", href: "/collections" },
    // { label: "About", href: "/about" },
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
      <header
        className="sticky top-0 z-50 backdrop-blur-md bg-opacity-95"
        style={{
          backgroundColor: `${colors.background}F5`,
        }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <LogoComponent
                theme={theme}
                className="text-xl font-light tracking-wider"
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
                className="hover:opacity-70 transition-opacity hidden md:flex"
              />

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

              <MobileMenu theme={theme} navigation={navigation} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div
                className="text-lg font-light mb-6 tracking-wider"
                style={{ color: colors.primary }}
              >
                {theme.name}
              </div>
              <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
                Minimal design for contemporary living. Quality products with
                thoughtful details that enhance your everyday experience.
              </p>
            </div>

            <div>
              <div className="font-medium mb-6">Shop</div>
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
              </ul>
            </div>

            <div>
              <div className="font-medium mb-6">About</div>
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
              </ul>
            </div>

            <div>
              <div className="font-medium mb-6">Connect</div>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:opacity-70 transition-opacity"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:opacity-70 transition-opacity"
                  >
                    Pinterest
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:opacity-70 transition-opacity"
                  >
                    Newsletter
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="mt-16 pt-8 border-t text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center"
            style={{ borderColor: `${colors.text}10` }}
          >
            <div>
              © {new Date().getFullYear()} {theme.name}. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0 flex space-x-8">
              <Link
                href="/privacy"
                className="hover:opacity-70 transition-opacity"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:opacity-70 transition-opacity"
              >
                Terms of Service
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

export default MinimalLayout;
