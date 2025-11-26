"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  RefreshCw,
  Upload,
  Trash2,
  RotateCw,
  ZoomIn,
  Check,
  X,
  Move,
} from "lucide-react";
import Cropper from "react-easy-crop";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api/api-client";

interface BannerUploaderProps {
  currentBanner?: string;
  onChange: (bannerData: { url: string; publicId: string }) => void;
  onDelete?: (publicId: string) => void;
  primaryColor?: string;
  secondaryColor?: string;
  storeName?: string;
  maxFileSizeMB?: number;
  publicId?: string;
}

export const BannerUploader = ({
  currentBanner,
  onChange,
  onDelete,
  primaryColor = "#333333",
  secondaryColor = "#f5f5f5",
  storeName = "Store",
  maxFileSizeMB = 5,
  publicId,
}: BannerUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    // Check file size
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      alert(`File size must be less than ${maxFileSizeMB}MB`);
      return;
    }

    // Create a preview
    const fileUrl = URL.createObjectURL(file);
    setImageSource(fileUrl);
    setIsCropping(true);

    // Reset crop state
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);

    // Clear the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const getCroppedImage = async (
    imageSrc: string,
    pixelCrop: any,
    rotation = 0
  ): Promise<Blob> => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    return new Promise((resolve, reject) => {
      image.onload = () => {
        const radians = (rotation * Math.PI) / 180;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const sin = Math.abs(Math.sin(radians));
        const cos = Math.abs(Math.cos(radians));
        const safeWidth = image.width * cos + image.height * sin;
        const safeHeight = image.width * sin + image.height * cos;

        const safeCanvas = document.createElement("canvas");
        safeCanvas.width = safeWidth;
        safeCanvas.height = safeHeight;
        const safeCtx = safeCanvas.getContext("2d");

        if (!ctx || !safeCtx) {
          reject(new Error("Canvas context error"));
          return;
        }

        // Draw rotated image onto safe canvas
        safeCtx.translate(safeWidth / 2, safeHeight / 2);
        safeCtx.rotate(radians);
        safeCtx.drawImage(image, -image.width / 2, -image.height / 2);

        // Crop the result onto a final canvas
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
          safeCanvas,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob from canvas"));
          }
        }, "image/jpeg");
      };

      image.onerror = () => {
        reject(new Error("Image failed to load"));
      };
    });
  };

  const uploadToServer = async (blob: Blob) => {
    setIsUploading(true);

    try {
      // Create a file from the blob
      const file = new File([blob], "banner.jpg", { type: "image/jpeg" });

      // Create FormData
      const formData = new FormData();
      formData.append("file", file);

      // Upload using the fetch API directly to avoid content-type issues
      const response = await fetch("/api/v1/images", {
        method: "POST",
        body: formData,
        // Explicitly not setting Content-Type header - let browser set it with boundary
      });

      if (!response.ok) {
        throw new Error("Upload failed: " + response.statusText);
      }

      const data = await response.json();

      // Update with the new image URL and publicId
      onChange({
        url: data.imageUrl,
        publicId: data.publicId,
      });

      // Clean up the temporary object URL
      if (imageSource) {
        URL.revokeObjectURL(imageSource);
        setImageSource(null);
      }

      setIsCropping(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveCrop = async () => {
    if (!imageSource || !croppedAreaPixels) return;

    try {
      const croppedImageBlob = await getCroppedImage(
        imageSource,
        croppedAreaPixels,
        rotation
      );

      await uploadToServer(croppedImageBlob);
    } catch (error) {
      console.error("Error saving cropped image:", error);
    }
  };

  const handleCancelCrop = () => {
    if (imageSource) {
      URL.revokeObjectURL(imageSource);
      setImageSource(null);
    }
    setIsCropping(false);
  };

  const handleDeleteImage = async () => {
    if (!publicId) return;

    setIsDeleting(true);

    try {
      await fetch(`/api/v1/images`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId }),
      });

      if (onDelete) {
        onDelete(publicId);
      }

      // Clear the current banner
      onChange({ url: "", publicId: "" });
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle responsive sizes based on device
  const cropperContainerStyle = {
    position: "relative" as const,
    width: "100%",
    height: "180px",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    overflow: "hidden",
  };

  if (isCropping) {
    return (
      <div className="flex flex-col gap-4">
        <div style={cropperContainerStyle}>
          <Cropper
            image={imageSource || ""}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={3 / 1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ZoomIn className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(value) => setZoom(value[0])}
              className="flex-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <RotateCw className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[rotation]}
              min={0}
              max={360}
              step={1}
              onValueChange={(value) => setRotation(value[0])}
              className="flex-1"
            />
          </div>

          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Move className="h-3 w-3" /> Drag to position • Pinch or use slider
            to zoom
          </p>
        </div>

        <div className="flex gap-2 mt-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancelCrop}
            className="gap-1"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSaveCrop}
            disabled={isUploading}
            className="gap-1"
          >
            {isUploading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="h-80 w-full rounded-md border bg-muted relative">
        {currentBanner ? (
          <div className="relative h-full w-full">
            <Image
              src={currentBanner}
              alt="Banner preview"
              fill
              className="object-cover rounded-md"
            />
          </div>
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              backgroundColor: secondaryColor,
            }}
          >
            <span className="text-xl font-bold" style={{ color: primaryColor }}>
              {storeName} Banner
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          type="file"
          id="banner-upload"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          ref={fileInputRef}
          disabled={isUploading || isDeleting}
        />
        <label htmlFor="banner-upload" className="flex-1">
          <Button
            type="button"
            variant="outline"
            className="w-full gap-1"
            disabled={isUploading || isDeleting}
            asChild
          >
            <span>
              <Upload className="h-4 w-4" />
              {currentBanner ? "Change Banner" : "Upload Banner"}
            </span>
          </Button>
        </label>

        {currentBanner && (
          <Button
            type="button"
            variant="outline"
            className="gap-1 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={handleDeleteImage}
            disabled={isDeleting || isUploading}
          >
            {isDeleting ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Remove
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-1">
        Recommended size: 1200×400px. Maximum file size: {maxFileSizeMB}MB.
      </p>
    </div>
  );
};
