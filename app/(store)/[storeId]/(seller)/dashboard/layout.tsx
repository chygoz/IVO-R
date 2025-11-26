import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { getResellerBySubdomain } from "@/actions/resellers";
import { PROTOCOL } from "@/constants";
import { removeDot } from "@/utils/remote-dot";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
}) {
  // Get the store ID from params
  const { storeId } = await params;

  // Check authentication server-side
  const session = await auth();

  if (!session) {
    // Redirect to login page on the same subdomain
    redirect(`/login?callbackUrl=/${storeId}/dashboard`);
  }

  // Verify this is a seller account
  if (session.user.role !== "seller") {
    // Redirect to login with error
    redirect(`/login?error=access_denied&callbackUrl=/${storeId}/dashboard`);
  }

  // Verify this seller owns this store by matching subdomain
  if ((session.user as any).subdomain !== storeId) {
    // Redirect to login on this subdomain with unauthorized error
    return redirect(
      `/login?error=unauthorized&callbackUrl=/${storeId}/dashboard`
    );
  }

  // Get store data
  const store = await getResellerBySubdomain(storeId);

  if (!store) {
    // Store not found

    return notFound();
  }

  // Get seller data with onboarding status

  const sellerData = session.user;

  // Check if onboarding is needed
  if (sellerData?.onboardingStatus && !sellerData.onboardingStatus.completed) {
    // Redirect to the appropriate onboarding step on the main domain
    const mainDomain = removeDot(
      process.env.NEXT_PUBLIC_ROOT_DOMAIN || "resellerivo.com"
    );
    return redirect(
      `${PROTOCOL}://${mainDomain}/onboarding/${sellerData.onboardingStatus.currentStep}`
    );
  }

  return (
    <div className="flex bg-[#F8F8F8] h-screen flex-col md:flex-row">
      {/*@ts-expect-error */}
      <DashboardSidebar store={store} />

      <div className="flex-1 flex flex-col">
        {/*@ts-expect-error */}
        <DashboardHeader store={store} />

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
