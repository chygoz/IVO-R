"use client";

import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Palette,
  Globe,
  Bell,
  CreditCard,
  Shield,
  Share2,
  Globe2,
} from "lucide-react";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();
  const params = useParams();
  const storeId = params.storeId as string;
  const base = `/${storeId}`;

  const tabs = [
    {
      id: "general",
      label: "General Settings",
      href: `${base}/dashboard/settings`,
      icon: Globe,
    },
    {
      id: "branding",
      label: "Branding & Theme",
      href: `${base}/dashboard/settings/branding`,
      icon: Palette,
    },
    {
      id: "domain",
      label: "Domain",
      href: `${base}/dashboard/settings/domain`,
      icon: Globe2,
    },
    {
      id: "notifications",
      label: "Notifications",
      href: `${base}/dashboard/settings/notifications`,
      icon: Bell,
    },
    {
      id: "security",
      label: "Security",
      href: `${base}/dashboard/settings/security`,
      icon: Shield,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your store preferences and configurations.
        </p>
      </div>

      <Card className="overflow-hidden">
        <Tabs defaultValue={getTabValue(pathname)} className="w-full">
          <TabsList className="flex w-full justify-start overflow-x-auto p-0 h-auto bg-muted/50 border-b rounded-none">
            {tabs.map((tab) => (
              <Link key={tab.id} href={tab.href} className="flex-shrink-0">
                <TabsTrigger
                  value={tab.id}
                  className={`relative py-3 px-4 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-background ${
                    isTabActive(pathname, tab.id)
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </div>

                  {isTabActive(pathname, tab.id) && (
                    <motion.div
                      layoutId="settings-active-tab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </TabsTrigger>
              </Link>
            ))}
          </TabsList>
        </Tabs>

        <div className="p-6">{children}</div>
      </Card>
    </div>
  );
}

function getTabValue(pathname: string): string {
  if (pathname.includes("/branding")) return "branding";
  if (pathname.includes("/domain")) return "domain";
  if (pathname.includes("/notifications")) return "notifications";
  if (pathname.includes("/security")) return "security";

  return "general";
}

function isTabActive(pathname: string, tabId: string): boolean {
  if (tabId === "general" && /\/[^/]+\/dashboard\/settings$/.test(pathname))
    return true;
  return new RegExp(`/settings/${tabId}`).test(pathname);
}
