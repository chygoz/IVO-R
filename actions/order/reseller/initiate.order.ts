
import { fetchAPI } from "@/actions/config";

type CartItem = {
  color?: string;
  size?: string;
  price: number;
  productId: string;
  quantity: number;
};

type InitiateOrderParams = {
  amount: string;
  cartItems: CartItem[];
};

export default async function initiateOrder({ amount, cartItems }: InitiateOrderParams) {
  const response = await fetchAPI({
    url: "/api/v1/orders/initiate",
    method: "POST",
    body: {
      amount,
      items: cartItems.map((item) => ({
        color: item.color || "default",
        size: item.size || "default",
        price: item.price.toString(),
        product: item.productId,
        quantity: item.quantity,
      })),
    },
  });
  console.log("initiateOrder response:", response);

  return response;
}
