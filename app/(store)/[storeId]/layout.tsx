import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LoadingTemplate } from "@/components/store/loading-template";
import { getResellerBySubdomain } from "@/actions/resellers";
import { ResellerStoreProvider } from "@/contexts/reseller-store-context";
import { capitalizeFirstLetter } from "@/lib/utils";
import { PROTOCOL } from "@/constants";

interface StoreLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    storeId: string;
  }>;
}

async function StoreDataProvider({
  storeId,
  children,
}: {
  storeId: string;
  children: React.ReactNode;
}) {
  if (!storeId) {
    notFound();
  }

  let store;
  try {
    store = await getResellerBySubdomain(storeId);
  } catch (error) {
    notFound();
  }

  if (!store) {
    notFound();
  }

  return (
    <ResellerStoreProvider store={store}>{children}</ResellerStoreProvider>
  );
}

export default async function StoreLayout({
  children,
  params,
}: StoreLayoutProps) {
  const { storeId } = await params;

  return (
    <Suspense fallback={<LoadingTemplate />}>
      <StoreDataProvider storeId={storeId}>{children}</StoreDataProvider>
    </Suspense>
  );
}

// Generate metadata for the store page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId?: string }>;
}) {
  const { storeId } = await params;

  if (!storeId) {
    return {
      title: "Store Not Found",
    };
  }
  try {
    // Fetch store data
    const store = await getResellerBySubdomain(storeId);

    if (!store) {
      return {
        title: "Store Not Found",
      };
    }

    return {
      title: {
        default: capitalizeFirstLetter(store.name),
        template: `%s | ${capitalizeFirstLetter(store.name)}`,
      },
      description:
        store?.storefront?.seo?.description ||
        `Welcome to ${capitalizeFirstLetter(store.name)}`,
      icons: {
        icon: store.logo || "/favicon.ico", // Use store logo as favicon or fallback to default
        apple: store.logo || "/apple-icon.png", // Apple touch icon
        shortcut: store.logo || "/shortcut-icon.png", // Shortcut icon
      },
      openGraph: {
        title: store.name,
        description:
          store?.storefront?.seo?.description || `Welcome to ${store.name}`,
        type: "website",
        url: (() => {
          const mainDomain = (
            process.env.NEXT_PUBLIC_ROOT_DOMAIN || "resellerivo.com"
          ).replace(/^\./, "");
          return `${PROTOCOL}://${store?.storefront.domain}.${mainDomain}`;
        })(),
        // Add OG image if available
        ...(store?.storefront?.theme?.bannerImage
          ? {
              images: [
                {
                  url: store.storefront.theme.bannerImage,
                  width: 1200,
                  height: 630,
                },
              ],
            }
          : {}),
      },
      twitter: {
        card: "summary_large_image",
        title: store.name,
        description:
          store.storefront.seo.description || `Welcome to ${store.name}`,
        // Add Twitter image if available
        ...(store.storefront?.theme?.bannerImage
          ? {
              images: [store.storefront.theme.bannerImage],
            }
          : {}),
      },
      // Add custom metadata if store has them
      // ...(store?.metadata ? store.metadata : {}),
    };
  } catch (e) {
    console.log(e, "error");
  }
}
