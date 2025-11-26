import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, CheckIcon } from "lucide-react";

export interface SelectItem {
  value: string;
  label: string;
}

interface CreateNewFormProps {
  closeModal: () => void;
}

export interface SearchableSelectProps {
  /** Array of items to display in the select */
  items: SelectItem[];
  /** Currently selected value */
  value: string;
  /** Callback when selection changes */
  onChange: (value: string) => void;
  /** Placeholder text when no item is selected */
  placeholder?: string;
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
  /** Message to show when no items match the search */
  emptyMessage?: string;
  /** Optional form component for creating new items */
  CreateNewForm?: React.ComponentType<CreateNewFormProps>;
  /** Text to display on the create new button */
  createNewText?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether the select is disabled */
  disabled?: boolean;
}

export default function SearchableSelect({
  items = [],
  value,
  onChange,
  placeholder = "Select an item...",
  searchPlaceholder = "Search items...",
  emptyMessage = "No items found.",
  CreateNewForm,
  createNewText = "Create New",
  className = "",
  disabled = false,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewDialog, setShowNewDialog] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [width, setWidth] = React.useState<number>(0);

  const selectedItem = items.find((item) => item.value === value);

  // Update width when the component mounts and when window resizes
  React.useEffect(() => {
    const updateWidth = () => {
      if (buttonRef.current) {
        setWidth(buttonRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return (
    <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={buttonRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={`border-[#E0E2E7] rounded-lg w-full capitalize justify-between ${className}`}
          >
            {selectedItem ? (
              <span>{selectedItem.label}</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="12"
              viewBox="0 0 13 12"
              fill="none"
              className="ml-2 h-4 w-4 shrink-0 text-[#667085]"
            >
              <path
                d="M3.5 4.5L6.5 7.5L9.5 4.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          align="start"
          style={{ width: width ? `${width}px` : "auto" }}
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    onSelect={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                    className="cursor-pointer capitalize"
                  >
                    {item.label}
                    <CheckIcon
                      className={`ml-auto h-4 w-4 ${
                        value === item.value ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
              {CreateNewForm && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      className="cursor-pointer"
                      onSelect={() => {
                        setOpen(false);
                        setShowNewDialog(true);
                      }}
                    >
                      <PlusCircleIcon className="mr-2 h-4 w-4" />
                      {createNewText}
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {CreateNewForm && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{createNewText}</DialogTitle>
            <DialogDescription>
              Create a new item if you cannot find what you are looking for.
            </DialogDescription>
          </DialogHeader>
          {<CreateNewForm closeModal={() => setShowNewDialog(false)} />}
        </DialogContent>
      )}
    </Dialog>
  );
}
