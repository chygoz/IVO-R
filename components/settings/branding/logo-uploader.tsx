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
} from "lucide-react";
import Cropper from "react-easy-crop";

interface LogoUploaderProps {
  currentLogo?: string;
  onChange: (logoData: { url: string; publicId: string }) => void;
  onDelete?: (publicId: string) => void;
  idealDimension?: number;
  maxFileSizeMB?: number;
  publicId?: string;
}

export const LogoUploader = ({
  currentLogo,
  onChange,
  onDelete,
  idealDimension = 400,
  maxFileSizeMB = 2,
  publicId,
}: LogoUploaderProps) => {
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

  // Fixed getCroppedImage function to work with Next.js
  const getCroppedImage = async (
    imageSrc: string,
    pixelCrop: any,
    rotation = 0
  ): Promise<Blob> => {
    const createImage = (url: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        // Use the global window.Image constructor instead of the imported Next.js Image
        const image = new window.Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.crossOrigin = "anonymous";
        image.src = url;
      });

    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    // Set canvas dimensions to the cropped size
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Draw white background (for transparent images)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create a centered rotated canvas for the source image
    const rotateCanvas = document.createElement("canvas");
    const rotateCtx = rotateCanvas.getContext("2d");

    if (!rotateCtx) {
      throw new Error("No rotate context");
    }

    // Set proper dimensions for the rotate canvas
    rotateCanvas.width = image.width;
    rotateCanvas.height = image.height;

    // Move to center, rotate, and draw the image
    rotateCtx.translate(image.width / 2, image.height / 2);
    rotateCtx.rotate((rotation * Math.PI) / 180);
    rotateCtx.translate(-image.width / 2, -image.height / 2);
    rotateCtx.drawImage(image, 0, 0);

    // Draw the rotated image at the cropped coordinates
    ctx.drawImage(
      rotateCanvas,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // Convert to blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          canvas.toBlob(
            (fallbackBlob) => resolve(fallbackBlob as Blob),
            "image/jpeg",
            0.95
          );
        }
      }, "image/png");
    });
  };

  const uploadToServer = async (blob: Blob) => {
    setIsUploading(true);

    try {
      // Create a file from the blob
      const file = new File([blob], "logo.png", { type: "image/png" });

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
      await fetch("/api/v1/images", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId }),
      });

      if (onDelete) {
        onDelete(publicId);
      }

      // Clear the current logo
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
    height: "280px",
    maxWidth: "280px",
    margin: "0 auto",
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
            aspect={1}
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
      <div className="h-28 w-28 rounded-md border bg-muted relative mx-auto sm:mx-0">
        {currentLogo ? (
          <div className="relative h-full w-full">
            <Image
              src={currentLogo}
              alt="Logo preview"
              fill
              className="object-contain rounded-md"
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-sm text-muted-foreground text-center px-2">
              No logo uploaded
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
        <input
          type="file"
          id="logo-upload"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          ref={fileInputRef}
          disabled={isUploading || isDeleting}
        />
        <label htmlFor="logo-upload">
          <Button
            type="button"
            variant="outline"
            className="gap-1"
            disabled={isUploading || isDeleting}
            asChild
          >
            <span>
              <Upload className="h-4 w-4" />
              {currentLogo ? "Change" : "Upload"}
            </span>
          </Button>
        </label>

        {currentLogo && (
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
    </div>
  );
};
