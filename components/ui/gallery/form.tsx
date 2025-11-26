"use client";
import ImagePicker from "@/components/ui/image-picker";
import React, { useState } from "react";
import { Media } from "@/actions/media/types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type GalleryImagesProps = {
  media: Media[];
  form: any;
};

function GalleryImages({ media, form }: GalleryImagesProps) {
  const [open, setOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const images = media.map((i) => i.url) || [];

  return (
    <FormField
      control={form.control}
      name="images"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel hidden>Images</FormLabel>
          <FormControl>
            <div className="flex flex-col  gap-2 bg-transparent border border-solid border-[#E0E2E7] p-2">
              <ImagePicker
                handleSetImages={(value) => {
                  field.onChange(value);
                }}
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
                images={images}
                open={open}
                setOpen={setOpen}
              />
              {/**display image */}
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default GalleryImages;
