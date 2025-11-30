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

interface BoldLayoutProps {
  children: React.ReactNode;
  theme: StoreTheme;
}

export function BoldLayout({ children, theme }: BoldLayoutProps) {
  const { colors } = theme;
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const base = `/${(pathname.split("/")[1] || "").trim()}`;

  const navigation = [{ label: "Shop", href: "/products" }];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
      }}
    >
      <header>
        <div
          className="py-4 sticky top-0 z-40"
          style={{
            backgroundColor: colors.primary,
          }}
        >
          <div className="max-w-[1300px] mx-auto px-4">
            <div className="flex justify-between items-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-10"
              >
                <LogoComponent
                  theme={theme}
                  className="text-xl font-bold uppercase"
                />

                <Navigation
                  theme={theme}
                  navigation={navigation}
                  className="hidden md:flex space-x-6"
                />
              </motion.div>

              <div className="flex items-center space-x-4">
                <SearchComponent
                  theme={theme}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors hidden md:flex"
                />

                <UserMenu
                  theme={theme}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                />

                {/* Use ResponsiveCartButton instead of separate desktop/mobile versions */}
                <ResponsiveCartButton
                  theme={theme}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors relative"
                  desktopMode="dropdown"
                  mobileMode="sidebar"
                />

                <MobileMenu theme={theme} navigation={navigation} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer
        className="py-16"
        style={{
          backgroundColor: colors.primary,
          color: colors.background,
        }}
      >
        <div className="max-w-[1300px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <div className="text-2xl font-bold uppercase mb-6">
                {theme.name}
              </div>
              <p className="opacity-80 max-w-md">
                Bold designs for those who dare to stand out. Make a statement
                with our collection of distinctive pieces that capture attention
                and express your unique style.
              </p>

              <div className="mt-8 flex space-x-4">
                <SocialLink href="#" colors={colors}>
                  <svg
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.99998 3.12165C12.4031 3.12165 12.6877 3.1308 13.6367 3.1741C14.5142 3.21415 14.9908 3.36077 15.3079 3.48398C15.728 3.64725 16.0278 3.84231 16.3428 4.15723C16.6577 4.47215 16.8528 4.772 17.016 5.19206C17.1392 5.50923 17.2859 5.98577 17.3259 6.86323C17.3692 7.81228 17.3783 8.0969 17.3783 10.5C17.3783 12.9031 17.3692 13.1878 17.3259 14.1368C17.2859 15.0143 17.1392 15.4908 17.016 15.808C16.8528 16.228 16.6577 16.5279 16.3428 16.8428C16.0278 17.1577 15.728 17.3528 15.3079 17.516C14.9908 17.6393 14.5142 17.7859 13.6367 17.8259C12.6879 17.8692 12.4032 17.8784 9.99998 17.8784C7.59672 17.8784 7.3121 17.8692 6.36323 17.8259C5.48574 17.7859 5.00919 17.6393 4.69206 17.516C4.27196 17.3528 3.97212 17.1577 3.6572 16.8428C3.34227 16.5279 3.14721 16.228 2.98398 15.808C2.86073 15.4908 2.71411 15.0143 2.67406 14.1368C2.63076 13.1878 2.62162 12.9031 2.62162 10.5C2.62162 8.0969 2.63076 7.81228 2.67406 6.86326C2.71411 5.98577 2.86073 5.50923 2.98398 5.19206C3.14721 4.772 3.34227 4.47215 3.6572 4.15723C3.97212 3.84231 4.27196 3.64725 4.69206 3.48398C5.00919 3.36077 5.48574 3.21415 6.36319 3.1741C7.31224 3.1308 7.59687 3.12165 9.99998 3.12165ZM9.99998 1.5C7.55571 1.5 7.24926 1.51036 6.28931 1.55416C5.33133 1.59789 4.67712 1.75001 4.10462 1.97251C3.51279 2.20251 3.01088 2.51025 2.51055 3.01058C2.01021 3.51092 1.70247 4.01283 1.47247 4.60466C1.24997 5.17716 1.09785 5.83137 1.05412 6.78935C1.01032 7.74926 1 8.05575 1 10.5C1 12.9443 1.01032 13.2508 1.05412 14.2107C1.09785 15.1687 1.24997 15.8229 1.47247 16.3954C1.70247 16.9872 2.01021 17.4891 2.51055 17.9895C3.01088 18.4898 3.51279 18.7975 4.10462 19.0275C4.67712 19.25 5.33133 19.4021 6.28931 19.4459C7.24926 19.4897 7.55571 19.5 9.99998 19.5C12.4443 19.5 12.7507 19.4897 13.7107 19.4459C14.6686 19.4021 15.3228 19.25 15.8953 19.0275C16.4872 18.7975 16.9891 18.4898 17.4894 17.9895C17.9898 17.4891 18.2975 16.9872 18.5275 16.3954C18.75 15.8229 18.9021 15.1687 18.9458 14.2107C18.9896 13.2508 19 12.9443 19 10.5C19 8.05575 18.9896 7.74926 18.9458 6.78935C18.9021 5.83137 18.75 5.17716 18.5275 4.60466C18.2975 4.01283 17.9898 3.51092 17.4894 3.01058C16.9891 2.51025 16.4872 2.20251 15.8953 1.97251C15.3228 1.75001 14.6686 1.59789 13.7107 1.55416C12.7507 1.51036 12.4443 1.5 9.99998 1.5ZM9.99998 5.87838C7.44753 5.87838 5.37835 7.94757 5.37835 10.5C5.37835 13.0525 7.44753 15.1217 9.99998 15.1217C12.5524 15.1217 14.6216 13.0525 14.6216 10.5C14.6216 7.94757 12.5524 5.87838 9.99998 5.87838ZM9.99998 13.5C8.34314 13.5 6.99996 12.1569 6.99996 10.5C6.99996 8.84317 8.34314 7.5 9.99998 7.5C11.6568 7.5 13 8.84317 13 10.5C13 12.1569 11.6568 13.5 9.99998 13.5ZM15.8842 5.69579C15.8842 6.29226 15.4007 6.77581 14.8042 6.77581C14.2077 6.77581 13.7242 6.29226 13.7242 5.69579C13.7242 5.09931 14.2077 4.6158 14.8042 4.6158C15.4007 4.6158 15.8842 5.09931 15.8842 5.69579Z"
                      fill="currentColor"
                    />
                  </svg>
                </SocialLink>
                <SocialLink href="#" colors={colors}>
                  <svg
                    width="18"
                    height="16"
                    viewBox="0 0 18 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.1452 4.12529C16.1452 4.29391 16.1452 4.44848 16.1452 4.58899C16.1452 5.85363 15.9063 7.10422 15.4286 8.34075C14.9789 9.54918 14.3185 10.6593 13.4473 11.671C12.6042 12.6827 11.4941 13.5117 10.1171 14.1581C8.76815 14.7763 7.27869 15.0855 5.64871 15.0855C3.59719 15.0855 1.71429 14.5375 0 13.4415C0.28103 13.4696 0.576112 13.4836 0.885246 13.4836C2.59953 13.4836 4.13115 12.9637 5.48009 11.9239C4.66511 11.8958 3.93443 11.6429 3.28806 11.1651C2.66979 10.6874 2.24824 10.0831 2.02342 9.35246C2.24824 9.40866 2.47307 9.43677 2.69789 9.43677C3.03513 9.43677 3.35831 9.38056 3.66745 9.26815C2.82436 9.09953 2.12178 8.67799 1.55972 8.00351C0.997658 7.32904 0.716628 6.55621 0.716628 5.68501C0.716628 5.65691 0.716628 5.64286 0.716628 5.64286C1.25059 5.92389 1.81265 6.07845 2.40281 6.10656C1.30679 5.34777 0.758782 4.32201 0.758782 3.02927C0.758782 2.3548 0.9274 1.73653 1.26464 1.17447C2.19204 2.29859 3.30211 3.19789 4.59485 3.87237C5.91569 4.54684 7.33489 4.92623 8.85246 5.01054C8.79625 4.72951 8.76815 4.44848 8.76815 4.16745C8.76815 3.15574 9.11944 2.29859 9.82201 1.59602C10.5527 0.86534 11.4239 0.5 12.4356 0.5C13.5035 0.5 14.4028 0.879391 15.1335 1.63817C15.9766 1.46956 16.7635 1.17447 17.4941 0.752927C17.2131 1.62412 16.6651 2.29859 15.8501 2.77635C16.6089 2.69204 17.3255 2.50937 18 2.22834C17.4941 2.95902 16.8759 3.59133 16.1452 4.12529Z"
                      fill="currentColor"
                    />
                  </svg>
                </SocialLink>
                <SocialLink href="#" colors={colors}>
                  <svg
                    width="16"
                    height="21"
                    viewBox="0 0 16 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.8211 2.5495C12.4444 1.22789 10.5392 0.5 8.45647 0.5C5.27505 0.5 3.31832 1.80411 2.23707 2.89806C0.904486 4.24623 0.140381 6.03635 0.140381 7.80948C0.140381 10.0358 1.0716 11.7445 2.63102 12.3802C2.7357 12.4231 2.84106 12.4447 2.94434 12.4447C3.27332 12.4447 3.53399 12.2295 3.6243 11.8842C3.67696 11.6861 3.79891 11.1974 3.85196 10.9852C3.96547 10.5663 3.87376 10.3648 3.62618 10.073C3.17516 9.53933 2.96512 8.90827 2.96512 8.08698C2.96512 5.64748 4.78161 3.05481 8.1483 3.05481C10.8196 3.05481 12.479 4.5731 12.479 7.0171C12.479 8.55937 12.1468 9.98765 11.5434 11.039C11.1241 11.7696 10.3868 12.6404 9.25495 12.6404C8.76549 12.6404 8.3258 12.4393 8.04838 12.0888C7.78631 11.7574 7.6999 11.3294 7.80533 10.8832C7.9244 10.3792 8.08678 9.8534 8.24393 9.34511C8.53053 8.41675 8.80147 7.53991 8.80147 6.84034C8.80147 5.64377 8.06584 4.83974 6.97111 4.83974C5.57985 4.83974 4.48989 6.2528 4.48989 8.05671C4.48989 8.9414 4.72501 9.60312 4.83145 9.85719C4.65618 10.5998 3.61454 15.0146 3.41696 15.8471C3.3027 16.3331 2.61449 20.1716 3.7536 20.4776C5.03345 20.8215 6.17747 17.0831 6.29392 16.6607C6.3883 16.3171 6.71849 15.018 6.92084 14.2195C7.53869 14.8146 8.5335 15.2169 9.50147 15.2169C11.3263 15.2169 12.9674 14.3958 14.1225 12.9049C15.2428 11.4588 15.8598 9.4432 15.8598 7.22975C15.8597 5.49936 15.1166 3.79341 13.8211 2.5495Z"
                      fill="currentColor"
                    />
                  </svg>
                </SocialLink>
              </div>
            </div>

            <div>
              <div className="font-bold uppercase mb-6 text-sm">Shop</div>
              <ul className="space-y-3">
                <li>
                  <Link
                    href={`${base}/products`}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  >
                    All Products
                  </Link>
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
                href="/privacy"
                className="opacity-60 hover:opacity-100 transition-opacity text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="opacity-60 hover:opacity-100 transition-opacity text-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar - shows when sidebar mode is active */}
      <CartSidebar />

      {/* Cart Loading Overlay */}
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
      className="w-10 h-10 rounded-full flex items-center justify-center text-sm"
    >
      {children}
    </a>
  );
}

export default BoldLayout;
