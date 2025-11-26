import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderType } from "@/types/order";
import OrderStatusBadge from "@/components/ui/order-status-badge";
import React from "react";
import { Button } from "@/components/ui/button";

interface OrdersTableProps {
  orders: OrderType[];
}

export const OrdersTable = ({ orders }: OrdersTableProps) => {
  const [expandedRows, setExpandedRows] = React.useState<string[]>([]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead />
          <TableHead>Order ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment Status</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <React.Fragment key={order._id}>
            <TableRow>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => toggleRow(order._id)}>
                  {expandedRows.includes(order._id) ? "-" : "+"}
                </Button>
              </TableCell>
              <TableCell className="font-medium">{order.orderId}</TableCell>
              <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell>{order.paymentStatus}</TableCell>
              <TableCell className="text-right">{order.totalPrice.value} {order.totalPrice.currency}</TableCell>
              <TableCell className="text-right">
                <a href={`/orders/${order.orderId}`} className="text-indigo-600 hover:text-indigo-900">View</a>
              </TableCell>
            </TableRow>
            {expandedRows.includes(order._id) && (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="p-4">
                    <h4 className="font-medium mb-2">Order Items</h4>
                    <ul>
                      {order.items.map((item) => (
                        <li key={item._id} className="flex justify-between">
                          <span>{item.name} x {item.quantity}</span>
                          <span>{item.price.value} {item.price.currency}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};