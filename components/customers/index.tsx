"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getCustomers, updateCustomerStatus } from "@/actions/customer";
import { StatusBadge } from "../ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Customer, CustomerFilters, CustomerStatus } from "@/types/customer";
import { MoreVertical, Eye, Trash } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PriceDisplay from "../ui/price.display";

const DEFAULT_PAGE_SIZE = 10;

export function CustomerList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  // Filters
  const [filters, setFilters] = useState<CustomerFilters>({
    status: (searchParams.get("status") as CustomerStatus) || "All Status",
    business: (params.storeId as string) || "",
    search: searchParams.get("search") || "",
    page: parseInt(searchParams.get("page") || "1"),
    limit: DEFAULT_PAGE_SIZE,
  });

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await getCustomers(filters);
      if (response.success && response.data) {
        setCustomers(response.data.results as Customer[]);
        setTotalItems(response.data.count);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setFilters({
      ...filters,
      search: value,
      page: 1, // Reset to first page on new search
    });
  };

  const handleStatusFilter = (status: CustomerStatus | "All Status") => {
    setFilters({
      ...filters,
      status,
      page: 1, // Reset to first page on filter change
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({
      ...filters,
      page: newPage,
    });
  };

  const handleToggleStatus = async (
    id: string,
    currentStatus: CustomerStatus
  ) => {
    try {
      const newStatus = currentStatus === "Active" ? "Blocked" : "Active";
      const response = await updateCustomerStatus(id, newStatus);

      if (response.success) {
        const updatedCustomers = customers.map((customer) =>
          customer.id === id ? { ...customer, status: newStatus } : customer
        );
        //@ts-expect-error
        setCustomers(updatedCustomers);
        toast.success(`Customer status updated to ${newStatus}`);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to update customer status");
    }
  };

  const handleViewCustomer = (id: string) => {
    router.push(`/dashboard/customers/${id}`);
  };

  const handleSelectCustomer = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, id]);
    } else {
      setSelectedCustomers(
        selectedCustomers.filter((customerId) => customerId !== id)
      );
    }
  };

  const handleSelectAllCustomers = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(customers.map((customer) => customer.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const totalPages = Math.ceil(totalItems / filters.limit);

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customers</h1>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search customer..."
          value={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />

        <div className="flex gap-2">
          <Button
            variant={filters.status === "All Status" ? "default" : "outline"}
            onClick={() => handleStatusFilter("All Status")}
            className="whitespace-nowrap"
          >
            All Status
          </Button>
          <Button
            variant={filters.status === "Active" ? "default" : "outline"}
            onClick={() => handleStatusFilter("Active")}
            className="whitespace-nowrap"
          >
            Active
          </Button>
          <Button
            variant={filters.status === "Blocked" ? "default" : "outline"}
            onClick={() => handleStatusFilter("Blocked")}
            className="whitespace-nowrap"
          >
            Blocked
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedCustomers.length === customers.length &&
                    customers.length > 0
                  }
                  onCheckedChange={(checked) =>
                    handleSelectAllCustomers(!!checked)
                  }
                  aria-label="Select all customers"
                />
              </TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Active Order</TableHead>
              <TableHead>Total Spending</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  Loading customers...
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedCustomers.includes(customer.id)}
                      onCheckedChange={(checked) =>
                        handleSelectCustomer(customer.id, !!checked)
                      }
                      aria-label={`Select ${customer.fullName}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium capitalize">
                        {customer.firstName} {customer.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {customer.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{customer.phone || "—"}</TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell>{customer.activeOrder}</TableCell>
                  <TableCell>
                    <PriceDisplay
                      currency="NGN"
                      value={`${customer.totalSpending || 0}`}
                    />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={customer.status} />
                  </TableCell>
                  <TableCell>
                    {customer.status === "Blocked" ? (
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewCustomer(customer.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewCustomer(customer.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 focus:text-red-500"
                            onClick={() =>
                              handleToggleStatus(customer.id, customer.status)
                            }
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Block
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {filters.page} of {totalPages || 1}
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page <= 1}
            >
              Previous
            </Button>

            <div className="flex items-center">
              <p>Page</p>
              <span className="mx-2">{filters.page}</span>
              <p>of {totalPages || 1}</p>
            </div>

            <Button
              variant="outline"
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page >= totalPages}
            >
              Next Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
