import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LoadingTemplate } from "@/components/store/loading-template";
import { getResellerBySubdomain } from "@/actions/resellers";
import { getTemplateComponent } from "@/components/store/templates/page-index";

interface PageProps {
  params: {
    storeId: string;
  };
}

export default async function StorePage({ params }: PageProps) {
  const { storeId } = await params;

  if (!storeId) {
    notFound();
  }

  // Fetch store data
  const store = await getResellerBySubdomain(storeId);

  if (!store) {
    notFound();
  }

  // Get the appropriate template component
  const Template = getTemplateComponent("bold");

  return (
    <Suspense fallback={<LoadingTemplate />}>
      <Template />
    </Suspense>
  );
}
