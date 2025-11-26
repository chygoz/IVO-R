import React, { useState } from "react";
import { Upload, Trash2, Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { uploadImage, deleteImage } from "@/actions/image";
import Image from "next/image";
import LoadingSpinner from "./loading-spinner";

interface UploadedImage {
  imageUrl: string;
  publicId: string;
}

interface ImageUploaderProps {
  onChange?: (value: UploadedImage | UploadedImage[] | null) => void;
  value?: UploadedImage | UploadedImage[] | null;
  uploadId: string;
  allowMultiple?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onChange,
  value,
  uploadId,
  allowMultiple = false,
}) => {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [deletingImage, setDeletingImage] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data) => {
      if (allowMultiple) {
        const updatedImages = Array.isArray(value) ? [...value, data] : [data];
        onChange?.(updatedImages);
      } else {
        onChange?.(data);
      }
    },
    onError: (error) => console.error("Upload error:", error),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteImage,
    onMutate: async (publicId) => {
      setDeletingImage(publicId);

      // Optimistic update: remove image immediately
      if (allowMultiple) {
        const updatedImages = (value as UploadedImage[])?.filter(
          (img) => img.publicId !== publicId
        );
        onChange?.(updatedImages.length > 0 ? updatedImages : null);
      } else {
        onChange?.(null);
      }
    },
    onSuccess: () => {
      setDeletingImage(null);
    },
    onError: (error) => {
      setDeletingImage(null);
      console.error("Delete error:", error);
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = allowMultiple ? Array.from(files) : [files[0]];
    fileArray.forEach((file) => {
      const formData = new FormData();
      formData.append("file", file);
      uploadMutation.mutate(formData);
    });
  };

  const handleDelete = (publicId: string) => {
    deleteMutation.mutate(publicId);
  };

  const images = Array.isArray(value) ? value : value?.imageUrl ? [value] : [];

  return (
    <div className="relative w-full sm:max-w-md mx-auto px-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 relative">
        {images.length > 0 ? (
          <div className={`grid ${allowMultiple ? "grid-cols-2 gap-4" : ""}`}>
            {images.map((img) => (
              <div
                key={img.publicId}
                className="relative group"
                onMouseEnter={() => setHoveredImage(img.publicId)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <Image
                  src={img.imageUrl}
                  width={800}
                  height={800}
                  alt="Uploaded"
                  className="w-full h-32 object-cover rounded-lg pointer-events-none"
                />
                <button
                  type="button"
                  onClick={() => handleDelete(img.publicId)}
                  disabled={deletingImage === img.publicId}
                  className={`absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full flex items-center justify-center transition-opacity duration-200 ease-in-out ${
                    hoveredImage === img.publicId ? "opacity-100" : "opacity-0"
                  } group-hover:opacity-100`}
                >
                  {deletingImage === img.publicId ? (
                    <LoadingSpinner />
                  ) : (
                    <Trash2 size={20} />
                  )}
                </button>
              </div>
            ))}
            {allowMultiple && (
              <label
                htmlFor={uploadId}
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <Plus size={24} />
                <input
                  id={uploadId}
                  type="file"
                  accept="image/*"
                  multiple={allowMultiple}
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploadMutation.isPending}
                />
              </label>
            )}
          </div>
        ) : (
          <label
            htmlFor={uploadId}
            className="flex flex-col items-center justify-center w-full p-4 sm:p-6 bg-primary-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="mb-1" />
            <span className="text-sm sm:text-base">
              {uploadMutation.isPending
                ? "Uploading..."
                : allowMultiple
                ? "Select Images"
                : "Upload"}
            </span>
            <input
              id={uploadId}
              type="file"
              accept="image/*"
              multiple={allowMultiple}
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploadMutation.isPending}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
