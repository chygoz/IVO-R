"use client"
import OrderService from "@/actions/orders";
import { OrderDetailType, OrderType } from "@/types/order";
import { useEffect, useState } from "react";

const useOrder = (id: string): OrderDetailType | null => {
    const [order, setOrder] = useState<OrderDetailType | null>(null);
    const getOrder = async (id: string) => {
        try {
            const order = await OrderService.getOrderById(id);
            setOrder(order);
        } catch (e) {
            console.log(e);
            setOrder(null);
        }
    }
    useEffect(() => {
        getOrder(id)
    }, [id])
    return order
}
export default useOrder