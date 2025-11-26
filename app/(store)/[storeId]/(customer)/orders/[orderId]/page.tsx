"use client"
import { OrderDetails } from "@/components/orders/order-details";
import { OrderItemsCard } from "@/components/orders/order-items-card";
import { OrderSummaryCard } from "@/components/orders/order-summary-card";
import PageHeader from "@/components/ui/page-header";
import useOrder from "@/hooks/use-order";

interface SingleOrderPageProps {
    params: {
        orderId: string;
    };
}

const SingleOrderPage = ({ params }: SingleOrderPageProps) => {
    const order = useOrder(params.orderId);

    if (!order) {
        return <div>Order not found</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <PageHeader title={`Order #${order.orderId}`} />
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                    <OrderDetails order={order} />
                </div>
                <div className="space-y-8">
                    <OrderItemsCard order={order} />
                    <OrderSummaryCard order={order} />
                </div>
            </div>
        </div>
    );
};

export default SingleOrderPage;