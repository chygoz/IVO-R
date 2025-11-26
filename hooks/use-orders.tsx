"use client"
import OrderService from "@/actions/orders";
import { OrderType } from "@/types/order";
import { useEffect, useState } from "react";
interface UseOrderProps {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
}
interface UseOrderReturn {
    orders: OrderType[]
    total: number
    pages: number
}
const useOrders = ({ page, limit, status, search, startDate, endDate }: UseOrderProps): UseOrderReturn => {
    const [ordersData, setOrdersData] = useState<UseOrderReturn>({
        orders: [],
        total: 0,
        pages: 0
    });
    const getOrders = async ({ page, limit, status, search, startDate, endDate }: UseOrderProps) => {
        try {
            const { orders, total, pages } = await OrderService.getUserOrders(
                page || 1,
                limit || 10,
                status || "all",
                search,
                startDate,
                endDate
            );
            setOrdersData({ orders, total, pages });
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {
        getOrders({ page, limit, status, search, startDate, endDate })
    }, [page, limit, status, search, startDate, endDate])
    return ordersData
}
export default useOrders