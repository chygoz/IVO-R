// "use client";

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { Separator } from "@/components/ui/separator";
// import { useRouter } from "next/navigation";
// import PriceDisplay from "../ui/price";
// import { motion } from "framer-motion";
// import { useMutation } from "@tanstack/react-query";
// import createResellerOrder from "@/actions/order/reseller/create.order";
// import { addPrices, getShippingDetails } from "@/contexts/cart/cart.utils";
// import { Currency } from "@/actions/types";

// type CheckoutProps = {
//   businessId: string;
// };

// function CheckoutInfo({ businessId }: CheckoutProps) {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);

//   const { total, items, getShippingInfo } = useCart();
//   const shipping = getShippingInfo();

//   const shippingCost = shipping ? getShippingDetails(shipping) : null;

//   const totalPayable = total
//     ? addPrices(
//       { currency: total.currency, value: `${total.value}` },
//       shippingCost?.cost || { currency: "NGN", value: "0" }
//     )
//     : { currency: "NGN", value: "0" };

//   const formatCartItems = (items: any[]) =>
//     items.map((item) => ({
//       productId: item.product._id,
//       quantity: item.quantity,
//       price: Number(item.price.value),
//       color: item.variant.color.hex,
//       size: item.product.variants[0].size.name,
//     }));

//   console.log('price', items[0].product.variants[0].size.name)

//   const createOrderMutation = useMutation({
//     mutationFn: () =>
//       createResellerOrder(businessId, {
//         paymentMethod: "flutterwave",
//         shippingId: shipping?._id?.toString()!,
//         amount: Number(total?.value),
//         cartItems: formatCartItems(items),
//       }),
//   });

//   const handleCheckout = async () => {
//     setIsLoading(true);
//     try {
//       const orderResponse = await createOrderMutation.mutateAsync();
//       const order = orderResponse.data;

//       if (!order?.orderId) throw new Error("Order ID missing in response");

//       router.push(`/checkout/${order.orderId}`);
//     } catch (error) {
//       console.error("Checkout failed", error);
//     } finally {
//       setIsLoading(false);
//     }

//     console.log({
//       shippingId: shipping?._id?.toString(),
//       amount: Number(total?.value),
//       cartItems: formatCartItems(items),
//     });
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: 30 }}
//       transition={{ duration: 0.4, ease: "easeInOut" }}
//       className="w-full bg-white rounded-xl shadow-sm md:ml-4 p-5 md:p-8 space-y-6"
//     >
//       <div className="flex items-center justify-between">
//         <h2 className="text-lg md:text-2xl font-semibold text-gray-900">
//           Order Summary
//         </h2>
//       </div>

//       <Separator />

//       <div className="flex items-center justify-between text-sm md:text-base font-medium text-gray-700">
//         <span>Cart Total:</span>
//         {total && (
//           <PriceDisplay
//             price={{
//               currency: total.currency,
//               value: total.value.toString(),
//             }}
//           />
//         )}
//       </div>

//       <div className="flex items-center justify-between text-base md:text-lg font-semibold text-gray-900">
//         <span>Estimated Total:</span>
//         {total && (
//           <PriceDisplay
//             price={{
//               currency: totalPayable.currency as Currency,
//               value: totalPayable.value.toString(),
//             }}
//           />
//         )}
//       </div>

//       <Separator />

//       <div>
//         <Button
//           onClick={handleCheckout}
//           disabled={isLoading}
//           className="w-full h-[48px] md:h-[56px] bg-[#20483F] text-white text-sm md:text-base font-semibold uppercase tracking-wide hover:bg-[#163830] transition-colors duration-300"
//         >
//           {isLoading ? (
//             <div className="flex items-center justify-center gap-2">
//               <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//               Loading...
//             </div>
//           ) : (
//             "Checkout"
//           )}
//         </Button>
//       </div>

//       <div className="pt-4">
//         <Link
//           href="/storefront"
//           className="flex items-center justify-center gap-2 text-sm md:text-base font-medium text-[#20483F] hover:underline"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={2}
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M10 19l-7-7m0 0l7-7m-7 7h18"
//             />
//           </svg>
//           Continue Shopping
//         </Link>
//       </div>
//     </motion.div>
//   );
// }

// export default CheckoutInfo;
