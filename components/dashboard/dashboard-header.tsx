"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import {
  Menu,
  Bell,
  Search,
  HelpCircle,
  Settings,
  LogOut,
  User,
  ChevronDown,
  ExternalLink,
  X,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

function Package(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function ShoppingBag(props: React.SVGProps<SVGSVGElement>) {
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

function Users(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function BarChart(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  );
}

function CreditCard(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

function LayoutDashboard(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}

interface DashboardHeaderProps {
  store: {
    id: string;
    name: string;
    logo?: string;
  };
}

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export function DashboardHeader({ store }: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const pathnameBase =
    typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "";
  const base = `/${pathnameBase}`;

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    setIsSearchOpen(false);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Helper function to close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Helper function to close search
  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <header className="bg-white border-b h-16 flex items-center px-4 sticky top-0 z-30">
      <div className="flex items-center justify-between w-full">
        {/* Mobile menu trigger */}
        <button
          className="p-2 rounded-full hover:bg-gray-100 md:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Store name (shown on mobile) */}
        <div className="md:hidden font-medium">{store.name}</div>

        {/* Desktop logo and breadcrumb */}
        <div className="hidden md:flex items-center space-x-2">
          <Link href={base} className="text-gray-500 hover:text-gray-700 text-sm">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            href={`${base}/dashboard`}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Dashboard
          </Link>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-1 md:space-x-3">
          {/* Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Visit store */}
          <Link
            href={base}
            target="_blank"
            className="hidden md:flex items-center text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2"
          >
            <span className="mr-1">Visit Store</span>
            <ExternalLink className="h-4 w-4" />
          </Link>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full relative">
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadNotifications}
                  </Badge>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex justify-between items-center p-3">
                <DropdownMenuLabel className="text-base">
                  Notifications
                </DropdownMenuLabel>
                {unreadNotifications > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs h-7"
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 hover:bg-gray-50 cursor-pointer border-l-2 ${
                        notification.read
                          ? "border-transparent"
                          : "border-primary"
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <Badge variant="secondary" className="h-5 text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-xs mb-1">
                        {notification.description}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {notification.time}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500">
                    No notifications
                  </div>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`${base}/dashboard/notifications`}
                  className="justify-center"
                >
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center text-sm px-2 py-1 hover:bg-gray-100 rounded-full">
                <Avatar className="h-8 w-8 mr-2">
                  {/*@ts-expect-error */}
                  <AvatarImage src={user?.profileImage} alt={user?.name} />
                  <AvatarFallback>
                    {getInitials(user?.name || "User")}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <div className="font-medium truncate max-w-[100px]">
                    {user?.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-[100px]">
                    {user?.email}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link
                  href={`${base}/dashboard/settings`}
                  className="cursor-pointer flex"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Store Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center">
              {store.logo ? (
                <Image
                  width={400}
                  height={400}
                  src={store.logo}
                  alt={store.name}
                  className="size-8 mr-2"
                />
              ) : (
                <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center mr-2">
                  <span className="text-primary font-semibold">
                    {store.name.charAt(0)}
                  </span>
                </div>
              )}
              <span className="font-semibold">{store.name}</span>
            </SheetTitle>
            <SheetClose className="absolute right-4 top-4">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </SheetHeader>

          <div className="py-4">
            <nav className="space-y-1 px-2">
              {[
                {
                  name: "Dashboard",
                  href: `${base}/dashboard`,
                  icon: LayoutDashboard,
                },
                {
                  name: "Products",
                  href: `${base}/dashboard/products`,
                  icon: Package,
                },
                {
                  name: "Orders",
                  href: `${base}/dashboard/orders`,
                  icon: ShoppingBag,
                },
                {
                  name: "Customers",
                  href: `${base}/dashboard/customers`,
                  icon: Users,
                },
                {
                  name: "Analytics",
                  href: `${base}/dashboard/analytics`,
                  icon: BarChart,
                },
                {
                  name: "Wallet",
                  href: `${base}/dashboard/wallet`,
                  icon: CreditCard,
                },
                {
                  name: "Subscription",
                  href: `${base}/dashboard/subscription`,
                  icon: CreditCard,
                },
                {
                  name: "Settings",
                  href: `${base}/dashboard/settings`,
                  icon: Settings,
                },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={closeMobileMenu} // Auto close on click
                >
                  <item.icon className="text-gray-500 h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t pt-4 px-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-100"
              onClick={closeMobileMenu} // Auto close on click
            >
              <ExternalLink className="text-gray-500 h-5 w-5 mr-3" />
              Visit Store
            </Link>

            <button
              onClick={() => {
                handleLogout();
                closeMobileMenu(); // Auto close on logout
              }}
              className="flex items-center px-3 py-2 mt-2 text-base font-medium rounded-md text-red-600 hover:bg-red-50 w-full text-left"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Search dialog */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={closeSearch}
            />

            {/* Search dialog */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-0 left-0 right-0 bg-white shadow-lg p-4 z-50"
            >
              <form onSubmit={handleSearch} className="flex items-center">
                <Search className="h-5 w-5 text-gray-500 mr-2" />
                <Input
                  type="text"
                  placeholder="Search for products, orders, customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-none shadow-none focus-visible:ring-0"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  className="ml-2 p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </form>

              {searchQuery && (
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-500 mb-2">
                    Quick Results
                  </div>
                  <div className="space-y-2">
                    <Link
                      href="/dashboard/products/classic-t-shirt"
                      className="block p-2 hover:bg-gray-50 rounded-md cursor-pointer flex items-center"
                      onClick={closeSearch} // Auto close on click
                    >
                      <Package className="h-4 w-4 text-gray-500 mr-2" />
                      <span>Classic T-Shirt</span>
                    </Link>
                    <Link
                      href="/dashboard/orders/1234"
                      className="block p-2 hover:bg-gray-50 rounded-md cursor-pointer flex items-center"
                      onClick={closeSearch} // Auto close on click
                    >
                      <ShoppingBag className="h-4 w-4 text-gray-500 mr-2" />
                      <span>Order #1234</span>
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
