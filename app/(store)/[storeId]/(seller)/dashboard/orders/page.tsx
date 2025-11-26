"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { OrderService } from "@/actions/orders";
import { OrderType } from "@/types/order";
import {
  SearchIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreVertical,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import OrderStatusBadge from "@/components/ui/order-status-badge";
import PageWrapper from "@/components/ui/page-wrapper";

// Status options for the filter
const statusOptions = [
  "All Status",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function OrderManagement() {
  const router = useRouter();
  const pathname = usePathname();
  const base = `/${(pathname.split("/")[1] || "").trim()}`;
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedDates, setSelectedDates] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState<string | null>(null);

  // Load orders on initial load and when filters change
  useEffect(() => {
    fetchOrders();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedStatus, selectedDates]);

  // Fetch orders with current filters
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const startDate = selectedDates[0]
        ? format(selectedDates[0], "yyyy-MM-dd")
        : undefined;
      const endDate = selectedDates[1]
        ? format(selectedDates[1], "yyyy-MM-dd")
        : undefined;

      const { orders, pages } = await OrderService.getOrders(
        currentPage,
        10,
        selectedStatus === "All Status" ? undefined : selectedStatus,
        searchQuery,
        startDate,
        endDate
      );

      setOrders(orders);
      setTotalPages(pages);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchOrders();
  };

  // Handle viewing order details
  const handleViewOrder = (orderId: string) => {
    router.push(`${base}/dashboard/orders/${orderId}`);
  };

  // Handle order action menu
  const toggleActionMenu = (orderId: string) => {
    setIsActionMenuOpen(isActionMenuOpen === orderId ? null : orderId);
  };

  // Handle updating order status
  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await OrderService.updateOrderStatus(orderId, status);
      // Refresh the order list
      fetchOrders();
      // Close action menu
      setIsActionMenuOpen(null);
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  // Handle refund
  const handleRefund = async (orderId: string) => {
    const reason = window.prompt("Please provide a reason for the refund:");
    if (!reason) return; // Cancel if no reason provided

    try {
      await OrderService.processRefund(orderId, reason);
      // Refresh orders
      fetchOrders();
      // Close action menu
      setIsActionMenuOpen(null);
    } catch (error) {
      console.error("Failed to process refund:", error);
    }
  };

  return (
    <PageWrapper>
      <div className="container mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Orders</h1>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <form onSubmit={handleSearch} className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </form>

          <div className="flex flex-wrap md:flex-nowrap gap-2">
            <div className="w-full md:w-auto">
              <select
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <button className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50">
              <CalendarIcon className="h-5 w-5 text-gray-500" />
              <span>Select Dates</span>
            </button>
          </div>
        </div>

        {/* Orders table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    onClick={() => handleViewOrder(order.orderId)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md">
                          {/* Product image placeholder */}
                          {order.items[0]?.variant?.gallery?.[0]?.url ? (
                            <Image
                              src={order.items[0].variant.gallery[0]?.url}
                              alt={order.items[0].name}
                              width={500}
                              height={500}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                              No img
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {order.items[0]?.name || "Product Name"}
                          </div>
                          <div className="text-sm text-gray-500">
                            +{order.items.length - 1} Product
                            {order.items.length > 2 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.customer?.name || "Customer Name"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customer?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.totalPrice.currency}{" "}
                      {Number(order.totalPrice.value).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative">
                        <button
                          onClick={() => toggleActionMenu(order.orderId)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>

                        {isActionMenuOpen === order.orderId && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              <button
                                onClick={() => handleViewOrder(order.orderId)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateStatus(
                                    order.orderId,
                                    "processing"
                                  )
                                }
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Update Order
                              </button>
                              <button
                                onClick={() => handleRefund(order.orderId)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                Refund Order
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center">
            <p className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            <span className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white">
              {currentPage}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
