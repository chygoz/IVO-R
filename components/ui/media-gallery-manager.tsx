"use client";
import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  Trash2,
  Upload,
  MoveHorizontal,
  Check,
  ArrowDownUp,
  Eye,
  ImageIcon,
  X,
  Search,
  Loader2,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Info,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { IGallery } from "@/store/product-store";
import { CustomPagination } from "./custom-pagination";
import { createMedia } from "@/actions/media/create.media";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useApiClient } from "@/lib/api/use-api-client";
import DeleteConfirmation from "./delete-confirmation";

interface Media {
  _id: string;
  url: string;
  publicId: string;
  createdAt: string;
}

interface MediaListResponse {
  media: Media[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface MediaGalleryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  colorCode: string | null;
  colorName?: string;
  colorHex?: string;
  selectedImages: IGallery[];
  onImagesChange: (images: IGallery[], colorCode: string) => void;
}

export function MediaGalleryManager({
  isOpen,
  onClose,
  colorCode,
  colorName = "",
  colorHex = "#000000",
  selectedImages,
  onImagesChange,
}: MediaGalleryManagerProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("gallery");
  const [isRearrangingImages, setIsRearrangingImages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<Media | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  // Media library state
  const [mediaLibrary, setMediaLibrary] = useState<Media[]>([]);
  const [selectedMediaIds, setSelectedMediaIds] = useState<Set<string>>(
    new Set()
  );
  // Create a working copy of the selected images for the UI
  const [workingSelectedImages, setWorkingSelectedImages] = useState<
    IGallery[]
  >([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const apiClient = useApiClient();

  // Initialize selected media
  useEffect(() => {
    if (selectedImages.length > 0) {
      const ids = new Set(selectedImages.map((img) => img._id));
      setSelectedMediaIds(ids);
      setWorkingSelectedImages([...selectedImages]); // Create a working copy
    } else {
      setSelectedMediaIds(new Set());
      setWorkingSelectedImages([]);
    }
  }, [selectedImages, isOpen]);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Only start dragging after moving 8px
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch media library
  const fetchMediaLibrary = useCallback(
    async (pageNum: number = 1, query: string = "") => {
      if (!isOpen) return;

      setIsLoading(true);
      try {
        let endpoint = `/api/v1/media/me/list?page=${pageNum}&limit=12`;
        if (query) {
          endpoint += `&search=${encodeURIComponent(query)}`;
        }

        const response = await apiClient.seller.get(endpoint);
        const data: MediaListResponse = response.data;

        setMediaLibrary(data.media);
        setTotalPages(data.pagination.totalPages);
        setPage(data.pagination.currentPage);
      } catch (error) {
        console.error("Failed to fetch media library:", error);
        toast({
          title: "Failed to load media",
          description: "Could not load your media library. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isOpen, toast]
  );

  // Initial fetch
  useEffect(() => {
    if (isOpen) {
      fetchMediaLibrary(1);
    }
  }, [fetchMediaLibrary, isOpen]);

  // Search handler
  const handleSearch = () => {
    fetchMediaLibrary(1, searchQuery);
  };

  // Handle media selection
  const toggleMediaSelection = (media: Media) => {
    const newSelection = new Set(selectedMediaIds);

    if (newSelection.has(media._id)) {
      newSelection.delete(media._id);
      // Also remove from working images
      setWorkingSelectedImages(
        workingSelectedImages.filter((img) => img._id !== media._id)
      );
    } else {
      newSelection.add(media._id);
      // Add to working images
      setWorkingSelectedImages([
        ...workingSelectedImages,
        {
          _id: media._id,
          url: media.url,
          mode: "model",
          type: "full",
          view: "front",
        },
      ]);
    }

    setSelectedMediaIds(newSelection);
  };

  // Set up dropzone for image uploads
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!colorCode || acceptedFiles.length === 0) return;

      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Show loading toast
        toast({
          title: "Uploading images",
          description: `Uploading ${acceptedFiles.length} images...`,
        });

        const newImages: IGallery[] = [];
        let completed = 0;

        for (const file of acceptedFiles) {
          const formData = new FormData();
          formData.append("image", file);

          const response = await apiClient.form.post(
            "/api/v1/media",
            formData,
            { requireBusiness: true, requireAuth: true }
          );

          if (!response.data) {
            throw new Error(`Failed to upload ${file.name}`);
          }

          const uploadedMedia = await response.data;

          newImages.push({
            _id: uploadedMedia._id,
            url: uploadedMedia.url,
            mode: "model",
            type: "full",
            view: "front",
          });

          completed++;
          setUploadProgress(
            Math.floor((completed / acceptedFiles.length) * 100)
          );
        }

        // Refresh the media library
        fetchMediaLibrary(1);

        // Add uploaded images to selected and to working images
        const updatedSelectedIds = new Set(selectedMediaIds);
        newImages.forEach((img) => updatedSelectedIds.add(img._id));
        setSelectedMediaIds(updatedSelectedIds);
        setWorkingSelectedImages([...workingSelectedImages, ...newImages]);

        toast({
          title: "Upload complete",
          description: `Successfully uploaded ${acceptedFiles.length} images`,
        });
      } catch (error) {
        console.error("Failed to upload images:", error);
        toast({
          title: "Upload failed",
          description: "Failed to upload images. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      colorCode,
      fetchMediaLibrary,
      selectedMediaIds,
      workingSelectedImages,
      toast,
    ]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: isUploading,
  });

  // Save selected images
  const handleSaveSelection = () => {
    if (!colorCode) return;

    // Use the working set of selected images
    onImagesChange(workingSelectedImages, colorCode);
    onClose();

    toast({
      title: "Images saved",
      description: `Updated gallery for ${colorName}`,
    });
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  };

  // Handle drag end for reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = workingSelectedImages.findIndex(
        (img) => img._id === active.id
      );
      const newIndex = workingSelectedImages.findIndex(
        (img) => img._id === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedImages = arrayMove(
          [...workingSelectedImages],
          oldIndex,
          newIndex
        );
        setWorkingSelectedImages(reorderedImages);

        // Show success feedback
        toast({
          title: "Image reordered",
          description: "Image position updated successfully",
          duration: 2000,
        });
      }
    }
  };

  // Handle rearrange button click
  const handleRearrangeClick = () => {
    if (workingSelectedImages.length === 0) {
      toast({
        title: "No images to rearrange",
        description: "Please select images first",
        variant: "destructive",
      });
      return;
    }

    setIsRearrangingImages(true);

    // Show helpful toast about how to rearrange
    toast({
      title: "Rearrange mode activated",
      description:
        "Drag images or use the left/right buttons to change their order. The first image will be the primary image.",
      duration: 5000,
    });
  };

  // Move image left in order
  const moveImageLeft = (index: number) => {
    if (index <= 0) return;

    const reorderedImages = [...workingSelectedImages];
    [reorderedImages[index], reorderedImages[index - 1]] = [
      reorderedImages[index - 1],
      reorderedImages[index],
    ];

    setWorkingSelectedImages(reorderedImages);

    toast({
      title: "Image moved",
      description: `Moved to position ${index}`,
      duration: 1500,
    });
  };

  // Move image right in order
  const moveImageRight = (index: number) => {
    if (index >= workingSelectedImages.length - 1) return;

    const reorderedImages = [...workingSelectedImages];
    [reorderedImages[index], reorderedImages[index + 1]] = [
      reorderedImages[index + 1],
      reorderedImages[index],
    ];

    setWorkingSelectedImages(reorderedImages);

    toast({
      title: "Image moved",
      description: `Moved to position ${index + 2}`,
      duration: 1500,
    });
  };

  // Sortable image component for drag and drop
  const SortableImage = ({
    image,
    index,
  }: {
    image: IGallery;
    index: number;
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: image._id,
    });

    const style = {
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
      transition,
      zIndex: isDragging ? 10 : 1,
      opacity: isDragging ? 0.5 : 1,
    } as React.CSSProperties;

    return (
      <div className="flex flex-col items-center">
        {/* Position and Primary indicators */}
        <div className="w-full flex justify-between mb-1">
          <span className="bg-primary text-white text-xs font-bold px-1.5 py-0.5 rounded">
            {index + 1}
          </span>
          {index === 0 && (
            <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded">
              Primary
            </span>
          )}
        </div>

        {/* Image container */}
        <div
          ref={setNodeRef}
          style={style}
          className={cn(
            "relative group rounded-md overflow-hidden border-2",
            isDragging ? "border-primary shadow-lg" : "border-gray-200",
            "transition-all duration-200 w-full aspect-square"
          )}
          {...attributes}
          {...listeners}
        >
          <Image
            width={400}
            height={400}
            src={image.url}
            alt={`Product image ${index + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Drag indicator overlay */}
          <div className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 flex items-center justify-center cursor-grab active:cursor-grabbing">
            <div className="bg-white rounded-full p-1.5 shadow-md">
              <MoveHorizontal className="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>

        {/* Control buttons below image */}
        <div className="flex justify-between w-full mt-2 gap-1">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 px-2",
              index === 0 && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => moveImageLeft(index)}
            disabled={index === 0}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 px-2",
              index === workingSelectedImages.length - 1 &&
              "opacity-50 cursor-not-allowed"
            )}
            onClick={() => moveImageRight(index)}
            disabled={index === workingSelectedImages.length - 1}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  // Static preview image component
  const ImagePreview = ({
    image,
    index,
  }: {
    image: IGallery;
    index: number;
  }) => {
    return (
      <div className="relative group">
        <div className="aspect-square rounded-md overflow-hidden border">
          <Image
            width={400}
            height={400}
            src={image.url}
            alt={`Product image ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            className="text-white hover:text-white hover:bg-red-500"
            onClick={() => {
              // Remove from working images
              setWorkingSelectedImages(
                workingSelectedImages.filter((img) => img._id !== image._id)
              );

              // Also remove from selectedMediaIds
              const updatedSelectedIds = new Set(selectedMediaIds);
              updatedSelectedIds.delete(image._id);
              setSelectedMediaIds(updatedSelectedIds);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        {index === 0 && (
          <div className="absolute top-2 right-2 bg-primary rounded-full p-1 shadow-sm text-xs text-white">
            <Check className="h-3 w-3" />
          </div>
        )}
      </div>
    );
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchMediaLibrary(newPage, searchQuery);
    }
  };

  // When entering rearrange mode, switch to the "selected" tab if not already there
  useEffect(() => {
    if (isRearrangingImages) {
      setActiveTab("selected");
    }
  }, [isRearrangingImages]);
  const handleDelete = (media: Media) => {
    setMediaToDelete(media);
    setShowDeleteDialog(true);
  }
  const deleteMedia = async (media: Media | null) => {
    try {
      if (!media) {
        toast({
          title: "No media selected",
          description: "Please select a media item to delete.",
          variant: "destructive",
        });
        return;
      }
      setIsDeleting(true);
      const response = await apiClient.seller.delete(
        `/api/v1/media/single/${media._id}`
      );
      fetchMediaLibrary(1); // Refresh media library after deletion
      toast({
        title: response.message || "Media deleted",
        description: `Successfully deleted media: ${media.url}`,
        variant: "default"
      });
      setIsDeleting(false);
    } catch (error: any) {
      setIsDeleting(false);
      console.error("Failed to delete media:", error);
      toast({
        title: "Delete failed",
        description: error?.message || "Failed to delete the media item. Please try again.",
        variant: "destructive",
      });
    }
  }
  // Find the active image for drag overlay
  const activeImage = activeId
    ? workingSelectedImages.find((img) => img._id === activeId)
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DeleteConfirmation
          header="Delete Image"
          description="Are You sure You Want To delete this Image"
          showDeleteDialog={showDeleteDialog}
          isDeleting={isDeleting}
          setShowDeleteDialog={setShowDeleteDialog}
          handleDelete={() => deleteMedia(mediaToDelete)}
        />
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {colorName && (
              <>
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: colorHex }}
                />
                <span className="capitalize">{colorName}</span> -
              </>
            )}
            {isRearrangingImages ? "Rearrange Images" : "Manage Color Images"}
          </DialogTitle>
          <DialogDescription>
            {isRearrangingImages
              ? "Drag images or use arrow buttons to reorder. The first image (marked 'Primary') will be shown in listings."
              : "Upload new images or select from your media library. These images will be shared across all size variants."}
          </DialogDescription>
        </DialogHeader>

        {colorCode && (
          <div className="space-y-4">
            {isRearrangingImages ? (
              <>
                <Card className="bg-primary/5 border border-primary/20 p-2 mb-4">
                  <CardContent className="p-2 flex items-start gap-2">
                    <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">How to rearrange images:</p>
                      <ul className="list-disc ml-5 mt-1 text-muted-foreground">
                        <li>Drag any image to reorder it</li>
                        <li>
                          Use the left/right arrow buttons below each image to
                          swap with adjacent images
                        </li>
                        <li>
                          The image labeled &quot;Primary&quot; will be the main
                          product image
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    Images are ordered from left to right
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => setIsRearrangingImages(false)}
                  >
                    Done Rearranging
                  </Button>
                </div>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToParentElement]}
                >
                  {workingSelectedImages.length === 0 ? (
                    <div className="text-center py-12 border rounded-lg">
                      <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                      <p className="mt-2 text-muted-foreground">
                        No images selected yet
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Select images from your media library
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto pb-4">
                      <SortableContext
                        items={workingSelectedImages.map((img) => img._id)}
                        strategy={horizontalListSortingStrategy}
                      >
                        <div className="flex gap-6 min-w-max px-4">
                          {workingSelectedImages.map((image, index) => (
                            <div key={image._id} className="w-28">
                              <SortableImage image={image} index={index} />
                            </div>
                          ))}
                        </div>
                      </SortableContext>

                      {activeId && activeImage && (
                        <DragOverlay
                          adjustScale={true}
                          dropAnimation={{
                            duration: 200,
                            easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
                          }}
                        >
                          <div className="w-28 rounded-md overflow-hidden border-2 border-primary shadow-xl">
                            <div className="aspect-square">
                              <Image
                                width={400}
                                height={400}
                                src={activeImage.url}
                                alt="Dragging image"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        </DragOverlay>
                      )}
                    </div>
                  )}
                </DndContext>
              </>
            ) : (
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="gallery" className="flex-1">
                    Browse Media Library
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="flex-1">
                    Upload New Images
                  </TabsTrigger>
                  <TabsTrigger value="selected" className="flex-1">
                    Selected ({selectedMediaIds.size})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="gallery" className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        placeholder="Search media..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="pr-10"
                      />
                      <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={handleSearch}
                      >
                        <Search className="h-4 w-4" />
                      </button>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => fetchMediaLibrary(page)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {isLoading ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-md overflow-hidden"
                        >
                          <Skeleton className="h-full w-full" />
                        </div>
                      ))}
                    </div>
                  ) : mediaLibrary.length === 0 ? (
                    <div className="text-center py-12 border rounded-lg">
                      <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                      <p className="mt-2 text-muted-foreground">
                        No images found
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {searchQuery
                          ? "Try a different search term"
                          : "Upload some images to get started"}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {mediaLibrary.map((media) => (
                          <div
                            key={media._id}
                            className={`relative group cursor-pointer aspect-square rounded-md overflow-hidden border-2 transition-colors ${selectedMediaIds.has(media._id)
                              ? "border-primary shadow-sm"
                              : "border-transparent hover:border-gray-300"
                              }`}
                            onClick={() => toggleMediaSelection(media)}
                          >
                            <Image
                              width={400}
                              height={400}
                              src={media.url}
                              alt="Media item"
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                type="button"
                                className="text-white hover:text-white hover:bg-red-500"
                                onClick={() => {
                                  handleDelete(media)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            {selectedMediaIds.has(media._id) && (
                              <div className="absolute top-1 right-1 bg-primary rounded-full p-1 shadow-sm text-white">
                                <Check className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <CustomPagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        className="mt-4"
                      />
                    </>
                  )}
                </TabsContent>

                <TabsContent value="upload">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors min-h-[200px] ${isDragActive
                      ? "border-primary bg-primary/5"
                      : "border-gray-300 hover:border-primary/50"
                      } ${isUploading ? "pointer-events-none" : ""}`}
                  >
                    <input {...getInputProps()} />
                    {isUploading ? (
                      <div className="text-center">
                        <Loader2 className="h-10 w-10 text-primary animate-spin mb-2 mx-auto" />
                        <p className="text-sm font-medium">
                          Uploading... {uploadProgress}%
                        </p>
                        <div className="w-64 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-center text-sm">
                          {isDragActive
                            ? "Drop images here..."
                            : "Drag & drop images here, or click to select files"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Max 5MB per image. Recommended: 1200×1200px
                        </p>
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="selected">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <p className="text-sm text-muted-foreground">
                        {selectedMediaIds.size} images selected.
                        {selectedMediaIds.size > 1 &&
                          " Click Rearrange to change the order."}
                      </p>

                      <div className="flex gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                className="gap-1"
                                onClick={handleRearrangeClick}
                                disabled={workingSelectedImages.length < 2}
                              >
                                <ArrowDownUp className="h-4 w-4" />
                                Rearrange
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Change the order of your images</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                className="gap-1"
                              >
                                <Eye className="h-4 w-4" />
                                Preview
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Preview how images will appear</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>

                    {workingSelectedImages.length === 0 ? (
                      <div className="text-center py-12 border rounded-lg">
                        <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="mt-2 text-muted-foreground">
                          No images selected yet
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Select images from your media library
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {workingSelectedImages.map((image, index) => (
                          <ImagePreview
                            key={image._id}
                            image={image}
                            index={index}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              onClose();
              setIsRearrangingImages(false);
            }}
          >
            Cancel
          </Button>
          {isRearrangingImages ? (
            <Button
              type="button"
              onClick={() => {
                setIsRearrangingImages(false);

                // Show confirmation
                toast({
                  title: "Rearrangement completed",
                  description: "Click Save Changes to apply your changes",
                  duration: 3000,
                });
              }}
              variant="default"
            >
              Done Rearranging
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSaveSelection}
              disabled={isUploading}
            >
              Save Changes
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
