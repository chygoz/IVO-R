import { OrderDetailType } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderSummaryCardProps {
  order: OrderDetailType;
}

export const OrderSummaryCard = ({ order }: OrderSummaryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{order.feeBreakdown?.subtotal} {order.totalPrice?.currency}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{order.deliveryCost?.value} {order.deliveryCost?.currency}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{order.totalPrice?.value} {order.totalPrice?.currency}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};