import { getMyMedia } from "@/actions/media";
import React, { Suspense } from "react";
import GalleryForm from "./form";
import { Skeleton } from "@/components/ui/skeleton";

type GalleryComponentProps = {
  form: any;
};

async function GalleryComponent({ form }: GalleryComponentProps) {
  const response = await getMyMedia();
  const media = response.data.results || [];
  return (
    <Suspense fallback={<Skeleton className="h-11 w-full" />}>
      <GalleryForm media={media} form={form} />
    </Suspense>
  );
}

export default GalleryComponent;
