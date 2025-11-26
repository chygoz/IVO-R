"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import ReactCrop, {
  type Crop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  X,
  Check,
  RefreshCw,
  Trash2,
  ZoomIn,
  AlertCircle,
  ImageIcon,
  RotateCw,
} from "lucide-react";

interface LogoUploaderProps {
  currentLogo?: string;
  onChange: (logoUrl: string) => void;
  onImageCropped?: (blob: Blob) => void;
  maxFileSizeMB?: number;
  idealDimension?: number;
  className?: string;
}

export function LogoUploader({
  currentLogo = "",
  onChange,
  onImageCropped,
  maxFileSizeMB = 5,
  idealDimension = 400,
  className = "",
}: LogoUploaderProps) {
  const [logoSrc, setLogoSrc] = useState<string>(currentLogo);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Function to handle file input change
  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadError(null);
      const file = e.target.files[0];

      // Check file size
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        setUploadError(`File size exceeds ${maxFileSizeMB}MB limit`);
        return;
      }

      // Check file type
      if (!file.type.match(/^image\/(jpeg|jpg|png|webp|svg\+xml)$/)) {
        setUploadError(
          "Unsupported file format. Please use JPG, PNG, WebP, or SVG."
        );
        return;
      }

      // Read the file and set for cropping
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setUploadedImage(reader.result?.toString() || null);
        setCropDialogOpen(true);
        // Reset crop settings
        setCrop(undefined);
        setCompletedCrop(null);
        setScale(1);
        setRotate(0);
      });
      reader.readAsDataURL(file);
    }
  };

  // Function to center and create initial crop when image loads
  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;

      // Create a centered crop based on the aspect ratio of 1:1 for logos
      const crop = centerCrop(
        makeAspectCrop(
          {
            unit: "%",
            width: 90,
          },
          1, // 1:1 aspect ratio
          width,
          height
        ),
        width,
        height
      );

      setCrop(crop);
    },
    []
  );

  // Function to apply crop and get the cropped image
  const handleCropComplete = useCallback(async () => {
    if (!imgRef.current || !completedCrop) return;

    try {
      setIsUploading(true);

      // Create a canvas to draw the cropped image
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("No 2d context");
      }

      // Calculate the pixel values for the crop
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      const pixelRatio = window.devicePixelRatio;

      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;

      // Adjust for device pixel ratio for sharper images on high-DPI displays
      ctx.scale(pixelRatio, pixelRatio);

      // Apply transformations
      const cropX = completedCrop.x * scaleX;
      const cropY = completedCrop.y * scaleY;
      const cropWidth = completedCrop.width * scaleX;
      const cropHeight = completedCrop.height * scaleY;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotate * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // Draw the image with crop, scale, and rotation
      ctx.drawImage(
        imgRef.current,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.restore();

      // Ensure we get a square image at the ideal dimension
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = idealDimension;
      finalCanvas.height = idealDimension;
      const finalCtx = finalCanvas.getContext("2d");

      if (!finalCtx) {
        throw new Error("No 2d context for final canvas");
      }

      finalCtx.drawImage(
        canvas,
        0,
        0,
        canvas.width,
        canvas.height,
        0,
        0,
        idealDimension,
        idealDimension
      );

      // Convert to Blob and then URL
      const blob = await new Promise<Blob>((resolve) => {
        finalCanvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else throw new Error("Failed to create blob");
        }, "image/png");
      });

      // Create a URL for the blob
      const croppedImageUrl = URL.createObjectURL(blob);

      // Call the provided callbacks
      onChange(croppedImageUrl);
      if (onImageCropped) onImageCropped(blob);

      // Update the displayed logo and close dialog
      setLogoSrc(croppedImageUrl);
      setCropDialogOpen(false);
      setIsUploading(false);

      // In a real app, you would upload to your server/cloud storage here
      // For demo, we're just using the local blob URL
    } catch (error) {
      console.error("Error cropping image:", error);
      setIsUploading(false);
      setUploadError("Failed to process image. Please try again.");
    }
  }, [completedCrop, rotate, scale, onChange, onImageCropped, idealDimension]);

  // Function to handle removing the logo
  const handleRemoveLogo = () => {
    setLogoSrc("");
    onChange("");
  };

  // Helper function to get initials from store name for the placeholder
  const getInitials = (storeName: string) => {
    if (!storeName) return "L";
    return storeName.charAt(0).toUpperCase();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col items-center">
        <div className="mb-4 relative">
          <div className="h-24 w-24 rounded-md border bg-muted relative overflow-hidden">
            {logoSrc ? (
              <div className="relative h-full w-full">
                <Image
                  src={logoSrc}
                  alt="Logo preview"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/10">
                <span className="text-2xl font-bold text-primary">
                  {getInitials("Store")}
                </span>
              </div>
            )}
          </div>

          {logoSrc && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="absolute -top-2 -right-2 h-6 w-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
              onClick={handleRemoveLogo}
              aria-label="Remove logo"
            >
              <X className="h-3 w-3" />
            </motion.button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="file"
            id="logo-upload"
            accept="image/*"
            className="hidden"
            onChange={onSelectFile}
            disabled={isUploading}
          />
          <label htmlFor="logo-upload">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              disabled={isUploading}
              asChild
            >
              <span>
                <Upload className="h-4 w-4" />
                {logoSrc ? "Change Logo" : "Upload Logo"}
              </span>
            </Button>
          </label>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Recommended: Square image, 400×400px (PNG, JPG, WebP, or SVG)
        </p>

        {uploadError && (
          <Alert variant="destructive" className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Crop Dialog */}
      <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
        <DialogContent className="max-w-[800px] w-full">
          <DialogHeader>
            <DialogTitle>Crop Your Logo</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="crop" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="crop">Crop & Resize</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent
              value="crop"
              className="focus-visible:outline-none focus-visible:ring-0"
            >
              {uploadedImage && (
                <>
                  <div className="overflow-hidden rounded-md border mb-4">
                    <ReactCrop
                      crop={crop}
                      onChange={(c) => setCrop(c)}
                      onComplete={(c) => setCompletedCrop(c)}
                      aspect={aspect}
                      circularCrop={false}
                      className="max-h-[500px] object-contain"
                    >
                      <Image
                        ref={imgRef}
                        width={800}
                        height={800}
                        src={uploadedImage}
                        alt="Upload"
                        style={{
                          transform: `scale(${scale}) rotate(${rotate}deg)`,
                          maxWidth: "100%",
                          maxHeight: "500px",
                          objectFit: "contain",
                        }}
                        onLoad={onImageLoad}
                      />
                    </ReactCrop>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Zoom</label>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(scale * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ZoomIn className="h-4 w-4 text-muted-foreground" />
                        <Slider
                          value={[scale * 100]}
                          min={50}
                          max={200}
                          step={1}
                          onValueChange={(value) => setScale(value[0] / 100)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Rotation</label>
                        <span className="text-xs text-muted-foreground">
                          {rotate}°
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RotateCw className="h-4 w-4 text-muted-foreground" />
                        <Slider
                          value={[rotate]}
                          min={0}
                          max={360}
                          step={1}
                          onValueChange={(value) => setRotate(value[0])}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Alert className="mt-4 bg-blue-50 text-blue-800 border-blue-200">
                    <ImageIcon className="h-4 w-4" />
                    <AlertDescription>
                      Drag to reposition. Use the sliders to zoom and rotate.
                      Click &quot;Apply Crop&quot; when finished.
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </TabsContent>

            <TabsContent
              value="preview"
              className="focus-visible:outline-none focus-visible:ring-0"
            >
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Logo Preview</p>
                  <div className="rounded-md border p-8 flex items-center justify-center bg-muted/50">
                    {completedCrop && imgRef.current ? (
                      <div className="h-24 w-24 relative">
                        <div className="overflow-hidden rounded-md h-full w-full border bg-white relative">
                          <Image
                            width={800}
                            height={800}
                            src={uploadedImage || ""}
                            alt="Preview"
                            style={{
                              position: "absolute",
                              left: `${-completedCrop.x}%`,
                              top: `${-completedCrop.y}%`,
                              width: `${100 / (completedCrop.width / 100)}%`,
                              height: `${100 / (completedCrop.height / 100)}%`,
                              transform: `scale(${scale}) rotate(${rotate}deg)`,
                              transformOrigin: "center center",
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="h-24 w-24 rounded-md bg-primary/10 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">
                          {getInitials("Store")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Dashboard Example</p>
                  <div className="h-36 rounded-md border bg-white p-2 flex flex-col">
                    <div className="h-8 border-b flex items-center px-2 gap-2">
                      {completedCrop && imgRef.current ? (
                        <div className="h-5 w-5 overflow-hidden rounded">
                          <Image
                            width={800}
                            height={800}
                            src={uploadedImage || ""}
                            alt="Preview"
                            style={{
                              position: "relative",
                              left: `${-completedCrop.x}%`,
                              top: `${-completedCrop.y}%`,
                              width: `${100 / (completedCrop.width / 100)}%`,
                              height: `${100 / (completedCrop.height / 100)}%`,
                              transform: `scale(${scale}) rotate(${rotate}deg)`,
                              transformOrigin: "center center",
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-5 w-5 bg-primary/10 rounded flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">
                            {getInitials("Store")}
                          </span>
                        </div>
                      )}
                      <span className="text-xs font-medium">
                        Your Store Name
                      </span>
                    </div>
                    <div className="flex-1 p-2">
                      <div className="h-4 w-24 bg-muted rounded-sm"></div>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        <div className="h-12 bg-muted rounded-sm"></div>
                        <div className="h-12 bg-muted rounded-sm"></div>
                        <div className="h-12 bg-muted rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Alert className="mt-4 bg-blue-50 text-blue-800 border-blue-200">
                <ImageIcon className="h-4 w-4" />
                <AlertDescription>
                  Your logo will be used throughout your store dashboard and
                  customer-facing pages.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setCropDialogOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCropComplete}
              disabled={!completedCrop || isUploading}
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Apply Crop
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
