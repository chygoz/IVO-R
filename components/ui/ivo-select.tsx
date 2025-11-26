import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { cn } from "@/lib/utils";
  
  type IVOSelectProps = {
    className?: string;
    value: string;
    label?: string;
    placeholder?: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
    render?: (data: { label: string; value: string }) => React.ReactNode;
  };
  
  export function IVOSelect({
    value,
    label,
    className,
    options,
    onChange,
    render,
    placeholder,
  }: IVOSelectProps) {
    return (
      <Select
        value={value}
        onValueChange={(value) => {
          if (!value) return;
          onChange(value);
        }}
      >
        <SelectTrigger className={cn("w-[180px]", className)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="capitalize">{label}</SelectLabel>
            {options.map((option, index) => (
              <SelectItem key={index.toString()} value={option.value}>
                {render ? render(option) : option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }