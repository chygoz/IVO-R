"use client";


import React, { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMedia } from "@/actions/media/create.media";
import revalidateTag from "@/actions/revalidate.tag";
import LoadingSpinner from "../loading-spinner";

type SelectedImage = {
  image: string;
  type: string;
  mode: string;
  view: string;
};

type ImagePickerProps = {
  open: boolean;
  setOpen: (state: boolean) => void;
  images: string[];
  selectedImages: Set<string>;
  setSelectedImages: React.Dispatch<React.SetStateAction<Set<string>>>;
  handleSetImages: React.Dispatch<React.SetStateAction<SelectedImage[]>>;
};

const ITEMS_PER_PAGE = 12;

const ImagePicker = ({
  open,
  setOpen,
  images,
  selectedImages,
  setSelectedImages,
  handleSetImages,
}: ImagePickerProps) => {

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createMedia,
    onSuccess() {
      // revalidateTag("my-media");
      queryClient.invalidateQueries({
        queryKey: ["images"]
      })
    },
  });

  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dragActive, setDragActive] = useState(false);

  const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentImages = images.slice(startIndex, endIndex);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    event.preventDefault();
    event.stopPropagation();

    if (files) {
      const formData = new FormData();
      formData.append("image", files[0]);
      const result = await mutation.mutateAsync(formData);
      if (result.data._id) {
        const newTotalPages = Math.ceil((images.length + 1) / ITEMS_PER_PAGE);
        setCurrentPage(newTotalPages);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const formData = new FormData();
      formData.append("image", e.dataTransfer.files[0]);
      const result = await mutation.mutateAsync(formData);
      if (result) {
        const newTotalPages = Math.ceil((images.length + 1) / ITEMS_PER_PAGE);
        setCurrentPage(newTotalPages);
      }
    }
  };

  const toggleImageSelection = (imageUrl: string) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(imageUrl)) {
      newSelection.delete(imageUrl);
    } else {
      newSelection.add(imageUrl);
    }
    setSelectedImages(newSelection);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        type="button"
        className="bg-[#F7F7F7] p-2 rounded-lg  text-primary hover:bg-primary hover:text-white"
      >
        Select Images
      </DialogTrigger>

      <DialogContent className="sm:max-w-[850px]">
        <DialogHeader>
          <DialogTitle>Media Picker</DialogTitle>
          <DialogDescription>
            Pick one or more images from your media or upload new ones
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {/* Styled File Input */}
          {mutation.isPending ? (
            <LoadingSpinner />
          ) : (
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${dragActive
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-gray-400"
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Drag and drop your images here, or click to browse
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Supports: JPG, PNG, GIF (Max 10MB each)
                </p>
              </div>
            </div>
          )}

          {/* Image Grid */}
          <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {currentImages.map((image, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setIsHovering(image)}
                onMouseLeave={() => setIsHovering(null)}
              >
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    width={900}
                    height={900}
                    priority
                    fetchPriority="high"
                    alt={`Media ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute inset-0 bg-black/40 transition-opacity ${isHovering === image || selectedImages.has(image)
                      ? "opacity-100"
                      : "opacity-0"
                      }`}
                  />
                </div>
                <button
                  onClick={() => toggleImageSelection(image)}
                  className={`absolute top-2 right-2 h-6 w-6 rounded-full flex items-center justify-center transition-colors ${selectedImages.has(image)
                    ? "bg-primary text-white"
                    : "bg-white text-gray-600"
                    }`}
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {selectedImages.size} images selected
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            {selectedImages.size > 0 ? (
              <Button
                type="button"
                className="bg-primary text-[var(--text-color)]"
                onClick={() => {
                  handleSetImages(
                    Array.from(selectedImages).map((value) => {
                      return {
                        image: value,
                        type: "half",
                        view: "front",
                        mode: "product",
                      };
                    })
                  );
                  setOpen(false);
                }}
              >
                Add Selected {"("}
                {selectedImages.size}
                {")"}
              </Button>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePicker;
