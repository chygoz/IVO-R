"use client"
import { OrderService } from "@/actions/orders";
import { OrdersClient } from "@/components/orders/orders-client";
import PageHeader from "@/components/ui/page-header";
import useOrders from "@/hooks/use-orders";

interface OrdersPageProps {
    searchParams: {
        page?: string;
        limit?: string;
        status?: string;
        search?: string;
        startDate?: string;
        endDate?: string;
    };
}

const OrdersPage = ({ searchParams }: OrdersPageProps) => {
    const page = Number(searchParams.page) || 1;
    const limit = Number(searchParams.limit) || 10;
    const { status, search, startDate, endDate } = searchParams;

    const { orders, pages } = useOrders({ page, limit, status, search, startDate, endDate });

    return (
        <div className="container mx-auto py-8">
            <PageHeader title="My Orders" />
            <OrdersClient
                orders={orders}
                totalPages={pages}
                currentPage={page}
            />
        </div>
    );
};

export default OrdersPage;