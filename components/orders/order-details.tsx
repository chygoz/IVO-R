import { OrderDetailType } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderDetailsProps {
  order: OrderDetailType;
}

export const OrderDetails = ({ order }: OrderDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-medium">Customer</h3>
            <p>{order.customer?.name}</p>
            <p>{order.customer?.email}</p>
            <p>{order.customer?.phone}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Shipping Address</h3>
            <p>{order.shipping?.firstName || ""} {order.shipping?.lastName || ""}</p>
            <p>{order.shipping?.address || ""}</p>
            <p>{order.shipping?.city}, {order.shipping?.state} {order.shipping?.zip}</p>
            <p>{order.shipping?.country}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Order Status</h3>
            <p>{order.orderStatus}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Payment Status</h3>
            <p>{order.paymentStatus}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};