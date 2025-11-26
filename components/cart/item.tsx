// "use client";

// import React from "react";
// import Image from "next/image";
// import IncreaseAndDecreaseButton from "./increase_and_decrease_button";
// import { Separator } from "@radix-ui/react-separator";
// import PriceDisplay from "../ui/price";
// import { Item } from "@/contexts/cart/cart.utils";
// import RemoveFromCart from "./remove.from.cart";
// import { motion } from "framer-motion";

// type CartItemProps = {
//   item: Item;
//   businessId: string;
// };

// function CartItem({ item, businessId }: CartItemProps) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: 30 }}
//       transition={{ duration: 0.4, ease: "easeOut" }}
//       layout
//       className="w-full border rounded-xl shadow-sm bg-white p-4 md:p-6"
//     >
//       <div className="flex flex-col md:flex-row gap-4 md:items-center">
//         {/* Product Image */}
//         <div className="relative h-[100px] w-[100px] md:h-[140px] md:w-[140px] rounded-lg overflow-hidden bg-gray-100">
//           <Image
//             src={item.variant.gallery[0].url}
//             fill
//             alt={item.product.name}
//             className="object-contain"
//             quality={90}
//             priority
//           />
//         </div>

//         {/* Product Info */}
//         <div className="flex flex-col justify-between flex-1">
//           <div className="flex justify-between items-start flex-wrap md:flex-nowrap">
//             <div className="space-y-1 md:space-y-2">
//               <p className="text-base md:text-lg font-semibold capitalize">
//                 {item.product.name}
//               </p>
//               <p className="text-sm text-muted-foreground">
//                 {item.variant.color.name} —{" "}
//                 <span className="text-gray-600">{item.variant.size.code}</span>
//               </p>
//             </div>

//             {/* Price Display */}
//             {item.price && (
//               <PriceDisplay
//                 price={item.price}
//                 className="text-right text-base md:text-lg font-semibold text-primary"
//               />
//             )}
//           </div>

//           <div className="flex justify-between items-center mt-4 gap-4 flex-wrap md:flex-nowrap">
//             {/* Quantity Controls */}
//             <IncreaseAndDecreaseButton quantity={item.quantity} id={item.id} />

//             {/* Remove Button */}
//             <RemoveFromCart item={item} businessId={businessId} />
//           </div>
//         </div>
//       </div>

//       {/* Bottom Separator */}
//       <Separator className="h-px mt-6 bg-gray-200" />
//     </motion.div>
//   );
// }

// export default CartItem;
