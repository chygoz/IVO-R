"use client";

import { motion } from "framer-motion";
import Image from "next/image";
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

interface ModernLayoutProps {
  children: React.ReactNode;
  theme: StoreTheme;
}

export function ModernLayout({ children, theme }: ModernLayoutProps) {
  const { colors } = theme;
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const base = `/${(pathname.split("/")[1] || "").trim()}`;

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
        className="sticky top-0 z-50 backdrop-blur-md bg-opacity-95 border-b"
        style={{
          backgroundColor: `${colors.background}F5`,
          borderColor: `${colors.text}10`,
        }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <LogoComponent theme={theme} className="text-xl font-bold" />
            </motion.div>

            <Navigation
              theme={theme}
              navigation={navigation}
              className="hidden md:flex space-x-8"
            />

            <div className="flex items-center space-x-4">
              <SearchComponent
                theme={theme}
                className="p-2 rounded-full hover:bg-black/5 transition-colors"
              />

              <UserMenu
                theme={theme}
                className="p-2 rounded-full hover:bg-black/5 transition-colors"
              />

              <ResponsiveCartButton
                theme={theme}
                className="p-2 rounded-full relative transition-colors"
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
        className="py-20"
        style={{ backgroundColor: colors.text, color: colors.background }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <div
                className="text-xl font-bold mb-6"
                style={{ color: colors.primary }}
              >
                {theme.name}
              </div>
              <p className="opacity-80 max-w-xs leading-relaxed">
                Modern designs for contemporary living. Our products combine
                form and function for a better everyday experience.
              </p>
            </div>

            <div>
              <div className="font-bold mb-6 uppercase text-sm tracking-wider">
                Shop
              </div>
              <ul className="space-y-4">
                <li>
                  <Link
                    href={`${base}/products`}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${base}/collections/new`}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  >
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${base}/collections/bestsellers`}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  >
                    Bestsellers
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${base}/collections/sale`}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  >
                    Sale
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-bold mb-6 uppercase text-sm tracking-wider">
                Company
              </div>
              <ul className="space-y-4">
                <li>
                  <Link
                    href={`${base}/about`}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${base}/sustainability`}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  >
                    Sustainability
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${base}/contact`}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${base}/careers`}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-bold mb-6 uppercase text-sm tracking-wider">
                Connect
              </div>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  >
                    Pinterest
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  >
                    Newsletter
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <div className="opacity-60 text-sm">
              © {new Date().getFullYear()} {theme.name}. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link
                href={`${base}/privacy`}
                className="opacity-60 hover:opacity-100 transition-opacity text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href={`${base}/terms`}
                className="opacity-60 hover:opacity-100 transition-opacity text-sm"
              >
                Terms of Service
              </Link>
              <Link
                href={`${base}/shipping`}
                className="opacity-60 hover:opacity-100 transition-opacity text-sm"
              >
                Shipping
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

export default ModernLayout;
