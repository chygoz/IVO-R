import { useState, useEffect } from "react";
import { Loader2, Plus, Search, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface Collection {
  _id: string;
  name: string;
  description: string;
  slug: string;
  business: string;
}

interface CollectionSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CollectionSelect({
  value,
  onChange,
  placeholder = "Select collection...",
}: CollectionSelectProps) {
  const { toast } = useToast();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");
  const [creating, setCreating] = useState(false);

  // Fetch collections
  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/collections");
        const data = await response.json();

        if (data.status === "ok") {
          // Fixed: Updated to match the actual nested API response structure
          setCollections(data.data.data.results || []);
        } else {
          toast({
            title: "Error",
            description: "Failed to load collections",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
        toast({
          title: "Error",
          description: "Failed to load collections",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [toast]);

  // Filter collections based on search term
  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected collection
  const selectedCollection = collections.find((c) => c._id === value);

  // Handle create new collection
  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      toast({
        title: "Error",
        description: "Collection name is required",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const response = await fetch("/api/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCollectionName.trim(),
          description: newCollectionDescription.trim(),
        }),
      });

      const data = await response.json();
      if (data.status === "ok") {
        // Add the new collection to the list
        const newCollection = data.data.data;
        if (newCollection.slug) {
          setCollections([...collections, newCollection]);
        }

        // Select the new collection
        onChange(newCollection._id);

        toast({
          title: "Success",
          description: `Collection "${newCollectionName}" created successfully`,
        });

        setNewCollectionName("");
        setNewCollectionDescription("");
        setCreateDialogOpen(false);
        setOpen(false);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create collection",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating collection:", error);
      toast({
        title: "Error",
        description: "Failed to create collection",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  // Handle collection selection
  const selectCollection = (collectionId: string) => {
    onChange(collectionId);
    setOpen(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedCollection ? selectedCollection.name : placeholder}
            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search collections..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            {loading ? (
              <div className="py-6 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">
                  Loading collections...
                </p>
              </div>
            ) : (
              <CommandList>
                <CommandEmpty>
                  <div className="py-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      No collection found
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => {
                        setOpen(false);
                        setNewCollectionName(searchTerm);
                        setCreateDialogOpen(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create &quot;{searchTerm}&quot;
                    </Button>
                  </div>
                </CommandEmpty>
                <CommandGroup>
                  {filteredCollections.map((collection) => (
                    <CommandItem
                      key={collection._id}
                      value={collection.name}
                      onSelect={() => selectCollection(collection._id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === collection._id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span>{collection.name}</span>
                        {collection.description && (
                          <span className="text-xs text-muted-foreground">
                            {collection.description}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            )}
            <div className="p-2 border-t">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setOpen(false);
                  setNewCollectionName(searchTerm);
                  setCreateDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Collection
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
            <DialogDescription>
              Add a new collection to your store
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="collection-name"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Collection Name
              </label>
              <Input
                id="collection-name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="e.g. Summer Collection, New Arrivals"
                className="w-full"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="collection-description"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Description (optional)
              </label>
              <Textarea
                id="collection-description"
                value={newCollectionDescription}
                onChange={(e) => setNewCollectionDescription(e.target.value)}
                placeholder="Describe this collection"
                className="w-full"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateCollection} disabled={creating}>
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Collection
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
