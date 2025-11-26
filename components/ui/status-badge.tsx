import { cn } from "@/lib/utils";
import { CustomerStatus } from "@/types/customer";

interface StatusBadgeProps {
  status: CustomerStatus;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <div className={cn("flex items-center", className)}>
      <span
        className={cn(
          "mr-2 h-2 w-2 rounded-full",
          status === "Active" ? "bg-green-500" : "bg-red-500"
        )}
      />
      <span
        className={cn(status === "Active" ? "text-green-500" : "text-red-500")}
      >
        {status}
      </span>
    </div>
  );
};
